namespace IBACS.Server.Models
{
    public class ResetPasswordModel
    {
        public string Username { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}