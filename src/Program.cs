using System.Reflection;
using Databank.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());



var app = builder.Build();

app.Run();
app.Endpoint();