using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace FitMatrix.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "You must provide your name.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "You must provide your email.")]
        public string Email { get; set; }

        [JsonIgnore]
        public string HashedPassword { get; set; }

        public string Password
        {
            set
            {
                HashedPassword = new PasswordHasher<User>().HashPassword(this, value);
            }
        }

        public bool IsValidPassword(string password)
        {
            var passwordVerification =
                new PasswordHasher<User>().VerifyHashedPassword(this, HashedPassword, password);

            return passwordVerification == PasswordVerificationResult.Success;
        }

    }
}