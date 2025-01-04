import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../Context/AuthContext.jsx';

import axios from "axios";

function MyClientAccount() {
    const [activeContent, setActiveContent] = useState("");
    const { userId } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    const handleItemClick = (content) => {
        setActiveContent(content);
    };
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Toggle the expanded state for an order
    const toggleExpanded = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);

    };


    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUserData = () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const decodedData = jwtDecode(token);
                    const email = decodedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
                    const roles = decodedData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                    setUserData({
                        email: email,
                        roles: roles ? [roles] : []
                    });
                    
                } catch (err) {
                    console.error("Failed to decode token:", err);
                    setError({ message: "Invalid token or error fetching user data." });
                }
            } else {
                setError({ message: "No token found. Please log in." });
            }
            setLoading(false);
        };

        fetchUserData();
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const response = await axios.get(`https://localhost:7131/api/orders?applicationUserId=${userId}`);
            setOrders(response.data);
            
            console.log(response.data);
        } catch {
            console.log("Could not fetch orders");
        }
    };

    const contentMap = {
        "Account details": (
            <div>
                <h5>User Profile</h5>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading user data: {error.message}</p>
                ) : (
                    <div>
                        <p>Email: {userData?.email || "null"}</p>
                        <p>Roles: {userData?.roles?.join(", ") || "null"}</p>
                    </div>
                )}
            </div>
        ),
        "Your Orders": (
            <div>
                <h5>Your Orders</h5>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading orders: {error.message}</p>
                ) : (
                            <div>
                                {orders.map((order) => (
                                    <div
                                        key={order.id} // Ensure each order has a unique key
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        <p><strong>Address:</strong> {order.address}</p>
                                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                        <p><strong>Total:</strong> {order.total} RON</p>
                                        <p><strong>Restaurant Name:</strong> {order.restaurantModel.name}</p>

                                        <button
                                            onClick={() => toggleExpanded(order.id)}
                                            style={{
                                                marginTop: "8px",
                                                padding: "8px 16px",
                                                backgroundColor: "#007BFF",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {expandedOrderId === order.id ? "See Less" : "See More"}
                                        </button>

                                        {/* Expanded Section */}
                                        {expandedOrderId === order.id && (
                                            <div style={{ marginTop: "16px" }}>
                                                {order.orderDetails.map((details, index) => (
                                                    <div key={index} style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                                                        <img src={details.restaurantMenuModel.imageUrl} alt={details.restaurantMenuModel.productName} style={{ width: "100px", height: "auto", borderRadius: "8px" }} />
                                                        <div>
                                                            <p><strong>Product Name:</strong> {details.restaurantMenuModel.productName}</p>
                                                            <p><strong>Product Price:</strong> {details.price} RON</p>
                                                            <p><strong>Quantity:</strong> {details.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                )}
            </div>
        )
    };

    

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-3 bg-light border-end" style={{ overflowY: 'auto' }}>
                    <h4 style={{ marginTop: '20px' }}>Your account</h4>
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
    );
}

export default MyClientAccount;
