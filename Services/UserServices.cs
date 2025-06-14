using DatabankApi.Domain.Entities;
using DatabankApi.Repositories;
using Microsoft.AspNetCore.Identity;
using DatabankApi.Mapping;
using DatabankApi.Contracts.Data;


namespace DatabankApi.Services;

public sealed class UserServices(IUserRepositories userRepositories) : IUserServices
{

    public async Task<bool> CreateUserAsync(UserDto user, IPasswordHasher<User> passwordHasher)
    {
        var userDto = user.ToDto(passwordHasher);
        return await userRepositories.CreateUserAsync(userDto);
    }

    public async Task<IEnumerable<User>> GetAllUserAsync(CancellationToken ct)
    {
        return await userRepositories.GetAllUserAsync(ct);
        
    }
}