using System.Text.Json.Serialization;

namespace IBACS.Server.Models
{
    public class LoginModel
    {
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }
}