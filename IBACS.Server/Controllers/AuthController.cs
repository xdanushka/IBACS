using Microsoft.AspNetCore.Mvc;
using IBACS.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System.Net.Mail;

namespace IBACS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        // Record to store OTP and its expiration time
        private record OtpData(string Code, DateTime Expiry);

        // In-memory storage for demonstration purposes (Use a Database for Production)
        private static readonly ConcurrentDictionary<string, string> Users = new();
        private static readonly ConcurrentDictionary<string, OtpData> PendingOTPs = new();

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            // Pre-seed an admin user; hash password using BCrypt
            if (!Users.ContainsKey("admin"))
            {
                Users.TryAdd("admin", BCrypt.Net.BCrypt.HashPassword("admin123"));
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Username) || string.IsNullOrEmpty(loginData.Password))
                return BadRequest(new { message = "Invalid input." });

            string username = loginData.Username.Trim().ToLower();

            // Verify password using BCrypt
            if (Users.TryGetValue(username, out string? storedHash) && BCrypt.Net.BCrypt.Verify(loginData.Password, storedHash))
                return Ok(new { token = GenerateJwtToken(username), message = "Login successful!" });

            return Unauthorized(new { message = "Invalid credentials!" });
        }

        [AllowAnonymous]
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] ResetPasswordModel model)
        {
            if (!Users.ContainsKey(model.Username.ToLower()))
                return NotFound(new { message = "User not found!" });

            string otp = new Random().Next(100000, 999999).ToString();
            
            // Set OTP expiry to 3 minutes
            PendingOTPs[model.Username.ToLower()] = new OtpData(otp, DateTime.UtcNow.AddMinutes(3));

            try
            {
                var smtpHost = _configuration["Smtp:Host"];
                var smtpUser = _configuration["Smtp:User"] ?? "noreply@ibacs.com";
                
                var smtpClient = new SmtpClient(smtpHost)
                {
                    Port = int.Parse(_configuration["Smtp:Port"] ?? "587"),
                    Credentials = new NetworkCredential(smtpUser, _configuration["Smtp:Pass"]),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage(smtpUser, model.Email, "Reset OTP", $"Your code: {otp}")
                {
                    IsBodyHtml = true
                };

                smtpClient.Send(mailMessage);
                return Ok(new { message = "OTP sent. Valid for 3 minutes." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Email failed: " + ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] ResetPasswordModel model)
        {
            if (PendingOTPs.TryGetValue(model.Username.ToLower(), out var otpData))
            {
                // Check if OTP has expired
                if (DateTime.UtcNow > otpData.Expiry)
                {
                    PendingOTPs.TryRemove(model.Username.ToLower(), out _);
                    return BadRequest(new { message = "OTP expired!" });
                }

                if (otpData.Code == model.Otp)
                    return Ok(new { message = "OTP Verified!" });
            }
            return BadRequest(new { message = "Invalid OTP!" });
        }

        // Helper method to generate JWT Token
        private string GenerateJwtToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "SUPER_SECRET_KEY_1234567890123456");
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username) }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(descriptor));
        }
    }
}