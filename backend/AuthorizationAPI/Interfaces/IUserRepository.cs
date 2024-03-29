﻿namespace AuthorizationAPI;

public interface IUserRepository
{
  void Update(AppUser user);
  Task<bool> SaveAllAsync();
  Task<IEnumerable<AppUser>> GetUsersAsync();
  Task<AppUser> GetuserByIdAsync(int id);
Task<AppUser> GetUserByUsernameAsync(string username);

}
