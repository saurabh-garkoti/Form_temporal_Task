using Microsoft.EntityFrameworkCore;
using server.Data;
using Temporalio.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuring EF Core with SQL Server
builder.Services.AddDbContext<ProfileContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register TemporalClient as singleton (once per app lifecycle)
builder.Services.AddSingleton<TemporalClient>(provider =>
    TemporalClient.ConnectAsync(new TemporalClientConnectOptions
    {
        TargetHost = "localhost:7233"
    }).GetAwaiter().GetResult());  // Use GetAwaiter().GetResult() only during startup!

// Enable CORS for React app vite port 5173
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalhost5173");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();