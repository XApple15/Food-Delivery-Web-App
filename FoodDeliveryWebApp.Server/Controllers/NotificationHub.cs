using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    public async Task SendOrderNotification(string restaurantId, string orderDetails)
    {
        await Clients.Group(restaurantId).SendAsync("ReceiveOrder", orderDetails);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var restaurantId = httpContext.Request.Query["restaurantId"];
        await Groups.AddToGroupAsync(Context.ConnectionId, restaurantId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var httpContext = Context.GetHttpContext();
        var restaurantId = httpContext.Request.Query["restaurantId"];
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, restaurantId);
        await base.OnDisconnectedAsync(exception);
    }
}
