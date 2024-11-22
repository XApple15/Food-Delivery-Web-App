using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;
using FoodDeliveryWebApp.API.Repositories;

namespace FoodDeliveryWebApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
       
        public AuthController(UserManager<ApplicationUser> userManager,ITokenRepository tokenRepository)
        {
            this._userManager = userManager;
            this._tokenRepository = tokenRepository;
        }


        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO) {
            var identityUser = new ApplicationUser
            {
                Email = registerRequestDTO.Email,
                UserName = registerRequestDTO.UserName,
                PhoneNumber = registerRequestDTO.PhoneNumber,
                Address = registerRequestDTO.Address
            };
            var identityResult = await _userManager.CreateAsync(identityUser, registerRequestDTO.Password);
            if (identityResult.Succeeded)
            {
                //add roles to this user
                if (registerRequestDTO.Roles != null && registerRequestDTO.Roles.Any())
                {
                    identityResult = await _userManager.AddToRolesAsync(identityUser,["Client"]);
                    if (identityResult.Succeeded)
                    {
                        return Ok("User created successfully");
                    }
                }
            }
            return BadRequest(identityResult.Errors);
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
             
            try
            {
                var user = await _userManager.FindByEmailAsync(loginRequestDTO.Email);
           
                if(user!= null)
            {
                var checkPassword = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);
                if (checkPassword)
                {
                   var roles = await _userManager.GetRolesAsync(user);

                    if (roles != null && roles.Contains(loginRequestDTO.Role))
                    {
                       var  jwtToken= _tokenRepository.CreateJWTToken(user, roles.ToList());
                        var response = new LoginResponseDTO
                        {
                            JwtToken = jwtToken
                        };
                        return Ok(response);

                    }
                }
            }
            return BadRequest("Invalid login attempt");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
