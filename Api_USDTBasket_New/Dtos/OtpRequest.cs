using System.ComponentModel.DataAnnotations;

namespace Api.Dtos
{
    public class OtpRequest
    {
        [Required]
        [EmailAddress]
        public string EmailId { get; set; }
    }
}
