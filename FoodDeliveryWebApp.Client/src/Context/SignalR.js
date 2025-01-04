import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7131/hubs/notifications?restaurantId=someRestaurantId")
    .withAutomaticReconnect()
    .build();

export default connection;
