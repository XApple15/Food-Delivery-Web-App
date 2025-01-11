using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;


public class NotificationHub : Hub
{
    private static readonly ConcurrentDictionary<string, string> ConnectedCouriers = new();

    public async Task SendOrderNotification(string restaurantId, string orderId)
    {
        await Clients.Group(restaurantId).SendAsync("ReceiveOrder", orderId);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var restaurantId = httpContext.Request.Query["restaurantId"];
        var courierId = httpContext.Request.Query["courierId"];
        if (!string.IsNullOrEmpty(courierId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Couriers");
            Console.WriteLine($"Courier connected: {courierId   }");
        }
        else if (!string.IsNullOrEmpty(restaurantId)) { 
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Restaurant-{restaurantId}");
            Console.WriteLine($"Restaurant connected: {restaurantId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        /*var httpContext = Context.GetHttpContext();
        var restaurantId = httpContext.Request.Query["restaurantId"];
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, restaurantId);
        */
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Couriers");
        Console.WriteLine($"Connection {Context.ConnectionId} disconnected.");

        await base.OnDisconnectedAsync(exception);
    }
}
