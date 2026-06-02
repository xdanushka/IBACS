using Microsoft.EntityFrameworkCore;
using IBACS.Server.Data;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace IBACS.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // Prevent circular reference errors in JSON serialization
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });

            // DbContext Registration: Connecting to the PostgreSQL database
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // JWT Authentication Configuration
            var jwtKey = builder.Configuration["Jwt:Key"] ?? "IBACS_SUPER_SECRET_KEY_FOR_JWT_TOKEN_123456";
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // Validate token signature using the secret key
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            // Swagger/OpenAPI support for API documentation
            builder.Services.AddSwaggerGen();

            // CORS Policy: Updated to include port 5174 for React frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy => policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:5174", "https://localhost:5174")
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                // Force HTTPS in production
                app.UseHttpsRedirection();
            }

            // Apply the CORS policy
            app.UseCors("AllowReactApp");

            // Critical Security Middleware Order: Authentication must precede Authorization
            app.UseAuthentication(); 
            app.UseAuthorization();

            // Map API Controllers
            app.MapControllers();

            app.Run();
        }
    }
}