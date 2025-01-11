import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Container, Card, Table, Modal,Toast } from "react-bootstrap";

import { useAuth } from "../../Context/AuthContext";
import connection from "../../Context/SignalR";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";


function CourierDashboard() {
    const { userId } = useAuth();
    const [newOrder, setNewOrder] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [activeContent, setActiveContent] = useState("");
    const [activeOrders, setActiveOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModalOrderDetails, setShowModalOrderDetails] = useState(false);
    const [notification, setNotification] = useState(null);
    const [triggerRefreshOrders, setTriggerRefreshOrders] = useState(0);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const connectionRef = useRef(null);


    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    useEffect(() => {
        if (!userId) return;
        const fetchOrders = async () => {

            try {
                console.log(userId);
                const response = await axios.get(`https://localhost:7131/api/orders?courierId=${userId}`);
                setAllOrders(response.data);
                console.log(response.data);
                const filteredOrders = response.data.filter(order => order.status === "AcceptedByCourier");
                setActiveOrders(filteredOrders);

            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        }

        fetchOrders();
    }, [userId,triggerRefreshOrders]);
   

    useEffect(() => {
        if (!userId || connectionRef.current) {
            return;
        }

        triggerToast("Connected successfully");
        const connectToHub = async () => {
            console.log("login" + userId);
            const conn = new signalR.HubConnectionBuilder()
                .withUrl(`https://localhost:7131/hubs/notifications?courierId=${userId}`)
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            connectionRef.current = conn; 

            conn.on("ReceiveOrderToAccept", (orderId) => {
                console.log("New order received courier", orderId);
                setNewOrder((prevOrders) => [...prevOrders, { id: orderId }]);

            });

            try {
                await conn.start();
                console.log("SignalR connection established");
            } catch (err) {
                console.error("SignalR Connection Error:", err);
                triggerToast("Failed to connect to the server");
            }
        };

        connectToHub();
    }, [userId]);


    const handleCloseModalOrderDetails = () => {
        setShowModalOrderDetails(false);
        setSelectedOrder(null);
    };
    const handleRowClickOrderDetails = (order) => {
        setSelectedOrder(order);

        setShowModalOrderDetails(true);
    };

    const showNotification = (orderId) => {
        fetchOrderDetails(orderId);
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`https://localhost:7131/api/orders/${orderId}`);

            const order = response.data;
            console.log(response.data);
            setNotification(response.data);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
            triggerToast("Failed to fetch order details");
        }
    };

    const renderOrdersTable = (orderTypes) => {
        let filteredOrders = activeOrders;
        if (orderTypes === "All") {
            filteredOrders = allOrders;
        } 

        return(
             <div>
                <h3>{orderTypes} Orders</h3>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Restaurant Address</th>
                            <th>Client Address</th>
                            <th>Status </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{ order.restaurantModel.address}</td>
                                <td>{order.address} </td>
                                <td>{order.status}</td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => handleRowClickOrderDetails(order)}>
                                        View
                                    </Button>{" "}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


                {selectedOrder && (
                    <Modal show={showModalOrderDetails} onHide={handleCloseModalOrderDetails}>
                        <Modal.Header closeButton>
                            <Modal.Title>Order Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                            <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                            <p><strong>Restaurant Address:</strong> {selectedOrder.restaurantModel.address}</p>
                            <p><strong>Client Address:</strong> {selectedOrder.address}</p>
                   
                        </Modal.Body>
                        <Modal.Footer>
                            {orderTypes === "Active" &&(
                                <Button variant="success" onClick={() => handleChangeOrderStatus(selectedOrder.id, "OrderDelivered")}>
                                    Delivered
                                </Button>
                            )}
                            <Button variant="secondary" onClick={handleCloseModalOrderDetails}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div >
        );
    };


    const handleChangeOrderStatus = async (orderId, action) => {
        console.log(`order ${orderId} ${action}`);
        let response = null;
        try {
            if (action === "AcceptedByCourier") {
                response = await axios.put(`https://localhost:7131/api/orders/${orderId}/acceptOrderByCourier?courierId=${userId}`);
            }
            if (action === "OrderDelivered") {
                response = await axios.put(`https://localhost:7131/api/orders/${orderId}/orderDelivered`);
            }
            console.log(`Succes changing order status ${orderId} ${action}`);
            setNotification(null);

            handleCloseModalOrderDetails();
            setNewOrder((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
            triggerToast("Order status changed successfully");
        }
        catch (err) {
            console.log(`Error changing order status  ${orderId} ${action}`);

            triggerToast("Failed to change order status");
            setNotification(null);
        }
        setTriggerRefreshOrders((prev) => prev + 1);

    };

    

    const handleItemClick = (content) => {
        setActiveContent(content);
    };

    const contentMap = {
        "New Orders": (
            <div>
                <h1>New Orders</h1>
                {newOrder?.map((order) => (
                    <div key={order.id}>
                        <p>Order ID: {order.id}</p>
                        <button onClick={() => showNotification(order.id)}>View</button>
                    </div>
                ))}

                {/* Notification */}
                {notification && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                textAlign: "center",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h2><strong>New Order Notification</strong></h2>
                            <p><strong>Order ID:</strong> {notification.id}</p>
                            <p><strong>Order Date:</strong>{new Date(notification.orderDate).toLocaleString()}</p>
                            <p><strong>Status :</strong> {notification.status}</p>
                            <p><strong>Restaurant Address: </strong> {notification.restaurantModel.address}</p>
                            <p><strong>Client Address: </strong>{notification.address}</p>
                            <button
                                onClick={() => handleChangeOrderStatus(notification.id, "AcceptedByCourier")}
                                style={{
                                    background: "green",
                                    color: "white",
                                    padding: "10px 20px",
                                    margin: "10px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Accept
                            </button>
                            <button
                                style={{
                                    background: "red",
                                    color: "white",
                                    padding: "10px 20px",
                                    margin: "10px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ),
        "Active Orders": (
            <div>
                {renderOrdersTable("Active")}
            </div>
        ),
        "All Orders": (
            <div>
                {renderOrdersTable("All")}
            </div>
        )
    };


    return (
        <Container >
            <div className="container-fluid vh-100">
                <div className="row h-100">
                    <div className="col-md-3 bg-light border-end" style={{ overflowY: 'auto' }}>
                        <h4 style={{ marginTop: '20px' }}>Courier Dashboard</h4>
                        <div className="list-group">
                            {Object.keys(contentMap).map((item) => (
                                <a
                                    key={item}
                                    className={`list-group-item list-group-item-action ${activeContent === item ? 'active' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-9 p-4">
                        <div className="border p-3">
                            {activeContent ? contentMap[activeContent] : <p>Select an item to see the content.</p>}
                        </div>
                    </div>
                </div>
            </div>


            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
       
        </Container>

    );
};
export default CourierDashboard;