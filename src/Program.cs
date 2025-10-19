
using System.Reflection;

using Databank.Database;
using Databank.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"));
});
//Appsettings.json represents as an environment variable on which you put all the sensitive data instread on the code.

var app = builder.Build();


app.Endpoint();
app.Run();


