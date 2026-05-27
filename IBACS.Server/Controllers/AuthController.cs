using Microsoft.AspNetCore.Mvc;
using IBACS.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;

namespace IBACS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private static readonly ConcurrentDictionary<string, string> RuntimeUsers = new();
        private static readonly ConcurrentDictionary<string, string> PendingOTPs = new();

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            RuntimeUsers.TryAdd("admin", "admin123");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Username) || string.IsNullOrEmpty(loginData.Password))
                return BadRequest(new { message = "Username and Password are required." });

            string inputUsername = loginData.Username.Trim().ToLower();
            if (!RuntimeUsers.ContainsKey(inputUsername)) RuntimeUsers.TryAdd(inputUsername, loginData.Password);

            if (RuntimeUsers[inputUsername] == loginData.Password)
                return Ok(new { token = GenerateMockJwtToken(inputUsername), message = "Login successful!" });

            return BadRequest(new { message = "Incorrect password!" });
        }

        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] ResetPasswordModel model)
        {
            if (!RuntimeUsers.ContainsKey(model.Username.ToLower()))
                return BadRequest(new { message = "User not found!" });

            string otp = new Random().Next(100000, 999999).ToString();
            PendingOTPs[model.Username.ToLower()] = otp;
            Console.WriteLine($"[DEBUG] OTP for {model.Username} is: {otp}"); 
            return Ok(new { message = "OTP generated successfully!" });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (PendingOTPs.TryGetValue(model.Username.ToLower(), out string? savedOtp) && savedOtp == model.Otp)
            {
                RuntimeUsers[model.Username.ToLower()] = model.NewPassword;
                PendingOTPs.TryRemove(model.Username.ToLower(), out _);
                return Ok(new { message = "Password reset successful!" });
            }
            return BadRequest(new { message = "Invalid OTP!" });
        }

        private string GenerateMockJwtToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "IBACS_SUPER_SECRET_KEY_FOR_JWT_TOKEN_123456");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
        
    }

}