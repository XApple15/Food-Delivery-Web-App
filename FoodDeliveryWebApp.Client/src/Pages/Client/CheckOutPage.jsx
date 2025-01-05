import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CartContext } from '../../Context/cart.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';
import axios from "axios";

function CheckOutPage() {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            alert("Please enter a valid address.");
            return;
        }
        try {

            const isSameRestaurant = cartItems.every(order => order.restaurantId === cartItems[0].restaurantId);
            if (isSameRestaurant === false) {
                throw new Error("You can only order from one restaurant at a time.");
            }

            const newOrder = {
                total: getCartTotal(),
                address : address,
                userId : userId,
                restaurantId : cartItems[0].restaurantId
            };

        
            const response = await axios.post("https://localhost:7131/api/orders", newOrder );

            console.log(response.data);
            const fetchedOrderId = response.data.id;

            for (const item of cartItems) {
                const orderData = {
                    restaurantMenuId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    orderId : fetchedOrderId, 
                };
                console.log(orderData);
             
                const response = await axios.post("https://localhost:7131/api/orderdetails", orderData);
                console.log(`Order created for item ${item.id}:`, response.data);
            }

            alert("Thank you for your purchase!");
            clearCart();
            navigate("/");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Check Out</h1>
            <div style={{ marginBottom: "20px", marginLeft: "25vh", marginRight: "25vh" }}>
                {cartItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                            <img src={item.imageUrl} alt={item.title} style={{ width: "120px", height: "120px", marginRight: "10px" }} />
                            <div>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>{item.productName}</h2>
                                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>Price: Ron {item.price}</p>
                                <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <p style={{ margin: "0 20px 0 0", fontSize: "16px", color: "#000", fontWeight: "bold" }}>Total: Ron {item.price * item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h2>Total: ${getCartTotal()}</h2>
            </div>
            <form style={{ maxWidth: "400px", margin: "0 auto" }} onSubmit={(e) => e.preventDefault()}>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="address" style={{ display: "block", marginBottom: "5px" }}>Address</label>
                    <textarea
                        id="address"
                        name="address"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    ></textarea>
                </div>
                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    style={{ backgroundColor: "#28a745", color: "#fff", padding: "10px 15px", border: "none", borderRadius: "5px", cursor: "pointer", display: "block", width: "100%" }}
                >
                    Place Order
                </button>
            </form>
        </div>
    );
}

export default CheckOutPage;
