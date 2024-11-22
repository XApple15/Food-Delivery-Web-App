using System.Net;

namespace FoodDeliveryWebApp.API.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;
        private readonly RequestDelegate _next;
        public ExceptionHandlerMiddleware(ILogger<ExceptionHandlerMiddleware> logger,RequestDelegate next)
        {
            this._logger = logger;
            this._next = next;
        }


        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch(Exception e)
            {
                var errId = Guid.NewGuid();
                // log the exception
                _logger.LogError(e, $"{errId} : {e.Message}");
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                httpContext.Response.ContentType = "application/json";

                var err = new
                {
                    Id = errId,
                    ErrorMessage = " Something went wrong, please try again later"
                };

                await httpContext.Response.WriteAsJsonAsync(err);
            }
        }
    }
}
