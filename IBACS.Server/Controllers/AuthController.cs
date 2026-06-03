using Microsoft.AspNetCore.Mvc;
using IBACS.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;

namespace IBACS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        // Data structure for OTP with expiry time
        private record OtpData(string Code, DateTime Expiry);
        
        // In-memory storage for Users and OTPs
        private static readonly ConcurrentDictionary<string, string> Users = new();
        private static readonly ConcurrentDictionary<string, OtpData> PendingOTPs = new();

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Register a new user
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginModel model)
        {
            string username = model.Username.Trim().ToLower();
            
            // Check if user already exists
            if (Users.ContainsKey(username))
                return BadRequest(new { message = "Account already created with this email! Please try logging in." });

            // Hash password and store the user
            Users.TryAdd(username, BCrypt.Net.BCrypt.HashPassword(model.Password));
            return Ok(new { message = "Account created successfully!" });
        }

        // Authenticate user and return JWT token
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Username))
                return BadRequest(new { message = "Invalid input." });

            string username = loginData.Username.Trim().ToLower();

            // Verify credentials against stored hash
            if (Users.TryGetValue(username, out string? storedHash) && BCrypt.Net.BCrypt.Verify(loginData.Password, storedHash))
                return Ok(new { token = GenerateJwtToken(username), message = "Login successful!" });

            return Unauthorized(new { message = "Invalid email or password!" });
        }

        // Generate and send OTP for password recovery
        [AllowAnonymous]
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] ResetPasswordModel model)
        {
            string username = model.Username.Trim().ToLower();
            if (!Users.ContainsKey(username))
                return NotFound(new { message = "User not found!" });

            string otp = new Random().Next(100000, 999999).ToString();
            PendingOTPs[username] = new OtpData(otp, DateTime.UtcNow.AddMinutes(3));

            return Ok(new { message = "OTP generated successfully.", code = otp }); 
        }

        // Verify the provided OTP
        [AllowAnonymous]
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] ResetPasswordModel model)
        {
            string username = model.Username.Trim().ToLower();
            if (PendingOTPs.TryGetValue(username, out var otpData))
            {
                if (DateTime.UtcNow > otpData.Expiry)
                {
                    PendingOTPs.TryRemove(username, out _);
                    return BadRequest(new { message = "OTP expired!" });
                }

                if (otpData.Code == model.Otp)
                    return Ok(new { message = "OTP Verified!" });
            }
            return BadRequest(new { message = "Invalid OTP!" });
        }

        // Update existing password
        [Authorize]
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ResetPasswordModel model)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (username == null || !Users.TryGetValue(username, out string? storedHash))
                return NotFound(new { message = "User not found!" });

            if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, storedHash))
                return BadRequest(new { message = "Current password is incorrect!" });

            Users[username] = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            return Ok(new { message = "Password updated successfully!" });
        }

        // Utility to generate JWT token
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