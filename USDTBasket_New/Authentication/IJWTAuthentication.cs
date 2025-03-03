namespace FXCapitalApi.Authentication
{
    public interface IJWTAuthentication
    {
        string GenerateUserToken(string userId);
    }
}
