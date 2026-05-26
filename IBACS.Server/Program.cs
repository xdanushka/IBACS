using Microsoft.EntityFrameworkCore;
using IBACS.Server.Data;
using System.Text.Json.Serialization;

namespace IBACS.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });

            // DbContext Registration (PostgreSQL Connection)
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Swagger services
            builder.Services.AddSwaggerGen();

            // Add CORS services configured for React Vite Dev Server
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy => policy.WithOrigins("http://localhost:5173", "https://localhost:5173") // Supports both http and https dev ports
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials()); // Allowed for secure cookies/headers tracking if needed
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseHttpsRedirection();
            }

            // CRITICAL MIDDLEWARE ORDER: CORS must be loaded before Authorization/Routing processes
            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}