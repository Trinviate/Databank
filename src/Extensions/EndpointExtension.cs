using System.Reflection;
using DatabankApi.Abstract;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace DatabankApi.Extensions;

public static class EndpointExtension
{
     public static IServiceCollection AddEndpoint(this IServiceCollection services, Assembly assembly)
    {
        ServiceDescriptor[] serviceDescriptors = assembly.DefinedTypes
        .Where(type => type is { IsAbstract: false, IsInterface: false } && type.IsAssignableTo(typeof(IEndpoint)))
        .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
        .ToArray();

        services.TryAddEnumerable(serviceDescriptors);
        return services;
    }

    public static IApplicationBuilder Endpoint(this WebApplication app, RouteGroupBuilder? routeGroupBuilder = null)
    {
        IEnumerable<IEndpoint> endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>();
        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;

        foreach (IEndpoint endpoint in endpoints)
        {
            endpoint.Endpoint(builder);
        }

        return app;
    }

    public static RouteHandlerBuilder HasPermission(this RouteHandlerBuilder app, string permission)
    {
        return app.RequireAuthorization(permission);

    }
}