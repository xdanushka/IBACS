namespace IBACS.Server.Models
{
    public class ResetPasswordModel
    {
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty; 
    public string? Otp { get; set; }
    public string? NewPassword { get; set; }
}
    
}