import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Table, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../Context/AuthContext";
import connection from "../../../Context/SignalR";
import * as signalR from "@microsoft/signalr";

function RestaurantDashboard() {
    const { userId } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [showEditRestaurantModal, setShowEditRestaurantModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newOrder, setNewOrder] = useState([]);
    const [fetchedRestaurantId, setFetchedRestaurantId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        imageUrl: "",
        rating: "5",
        applicationuserid: userId,
    });
    const [productData, setProductData] = useState({
        productName: "",
        description: "",
        price: "",
        imageUrl: "",
        restaurantId: null,
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc"); 


    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`https://localhost:7131/api/restaurant?applicationUserId=${userId}`);
                const restaurant = response.data[0];
                setRestaurant(restaurant);
                setProductData({ ...productData, restaurantId: restaurant?.id });
                if (restaurant) {
                    setRestaurantData({
                        name: restaurant.name,
                        address: restaurant.address,
                        phoneNumber: restaurant.phoneNumber,
                        description: restaurant.description,
                        imageUrl: restaurant.imageUrl,
                        rating: restaurant.rating,
                        applicationuserid: userId,
                    });
                    setFetchedRestaurantId(restaurant.id);
                    fetchProducts(restaurant.id);
                }
            } catch (error) {
                console.error("Failed to fetch restaurant", error);
            }
        };

        const fetchProducts = async (restaurantId) => {
            try {
                const response = await axios.get(`https://localhost:7131/api/restaurantmenu?restaurantid=${restaurantId}`);
                setProducts(response.data || []);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchRestaurant();
    }, [userId]);

    useEffect(() => {
        if (!fetchedRestaurantId) return;

        const connectToHub = async () => {
            const conn = new signalR.HubConnectionBuilder()
                .withUrl(`https://localhost:7131/hubs/notifications?restaurantId=${fetchedRestaurantId}`)
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            conn.on("ReceiveOrder", (orderId) => {
                console.log("New Order Received:", orderId);
                setNewOrder((prevOrders) => [...prevOrders, { id: orderId }]);
            });

            try {
                await conn.start();
                console.log("SignalR connection established");
            } catch (err) {
                console.error("SignalR Connection Error:", err);
            }
        };

        connectToHub();
    }, [fetchedRestaurantId]);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await axios.get(`https://localhost:7131/api/orders?restaurantId=${fetchedRestaurantId}`);
                console.log("All Orders:", response.data);
                setSortedOrders(response.data);
            } catch (err) {
                console.error("Error fetching all orders:", err);
            }
        };

        if (fetchedRestaurantId) {
            fetchAllOrders();
        }
    }, [newOrder, fetchedRestaurantId]);


    const handleSort = () => {
        const sorted = [...sortedOrders].sort((a, b) => {
            if (sortOrder === "asc") {
                return a.status.localeCompare(b.status);
            } else {
                return b.status.localeCompare(a.status);
            }
        });
        setSortedOrders(sorted);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc"); 
    };

    const handleNotificationAction =  async (orderId, action) => {
        console.log(`Order ${orderId} ${action}`);
        if (action === "accepted") {
            try {
                const response = await axios.put(`https://localhost:7131/api/orders/${orderId}/acceptOrderByRestaurant`);
                console.log("Order status updated successfully:", response.data);
            }
            catch (err) {
                console.error("Failed to update order status:", err);
            }
        }
        setNewOrder((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        setNotification(null); // Close notification
    };

    const showNotification = (orderId) => {
        fetchOrderDetails(orderId);
     //   setNotification(fetchOrderDetails(orderId));
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`https://localhost:7131/api/orders/${orderId}`); // Adjust the URL if necessary

            const order = response.data;
            // console.log(response.data);
            setNotification(response.data);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData({ ...restaurantData, [name]: value });
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleEditRestaurantSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = restaurantData.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            }

            const updatedRestaurant = { ...restaurantData, imageUrl };
            const response = await axios.put(`https://localhost:7131/api/restaurant/${restaurant.id}`, updatedRestaurant);
            setRestaurant(response.data);
            setMessage("Restaurant updated successfully!");
            setShowEditRestaurantModal(false);
        } catch (error) {
            console.error("Failed to update restaurant", error);
            setMessage("Failed to update restaurant.");
        }
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("fileName", imageFile.name);

            let imageUrl = productData.imageUrl;
            if (imageFile) {
                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            }

            const newProduct = {
                ...productData,
                imageUrl: imageUrl,
            };

            const response = await axios.post("https://localhost:7131/api/restaurantmenu", newProduct);
            setProducts([...products, response.data]);
            setMessage("Product added successfully!");
            setShowAddProductModal(false);
            setProductData({
                productName: "",
                description: "",
                price: "",
                imageUrl: "",
                restaurantId: restaurant.id,
            });
        } catch (error) {
            console.error("Failed to add product", error);
            setMessage("Failed to add product.");
        }
    };

    const handleEditProduct = async (product) => {
        setProductData(product);
        setShowModal(true);
    };

    const handleEditProductSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedProduct = { ...productData };

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);
                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                updatedProduct.imageUrl = uploadResponse.data.filePath;
            }

            const response = await axios.put(`https://localhost:7131/api/restaurantmenu/${productData.id}`, updatedProduct);
            setProducts(products.map((p) => (p.id === productData.id ? response.data : p)));
            setMessage("Product updated successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Failed to update product", error);
            setMessage("Failed to update product.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`https://localhost:7131/api/restaurantmenu/${productId}`);
                setProducts(products.filter((product) => product.id !== productId));
                setMessage("Product deleted successfully!");
            } catch (error) {
                console.error("Failed to delete product", error);
            }
        }
    };

    return (
        <Container className="mt-5">
            <h1>Restaurant Dashboard</h1>

            {restaurant ? (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>{restaurant.name}</Card.Title>
                            <Card.Text>
                                <strong>Address:</strong> {restaurant.address} <br />
                                <strong>Phone:</strong> {restaurant.phoneNumber} <br />
                                <strong>Description:</strong> {restaurant.description} <br />
                                <strong>Rating:</strong> {restaurant.rating}<br />
                            </Card.Text>
                            {restaurant.imageUrl && (
                                <Card.Img
                                    variant="top"
                                    style={{ maxWidth: "10%", maxHeight: "300px", objectFit: "cover" }}
                                    src={restaurant.imageUrl}
                                    alt="Restaurant Image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                    <Button variant="primary" onClick={() => setShowEditRestaurantModal(true)}>
                        Edit Restaurant
                    </Button>

                    {/* Products Table */}
                    <h3 className="mt-4">Products</h3>
                    <Button variant="secondary" onClick={() => setShowAddProductModal(true)} className="mb-3">
                        Add Product
                    </Button>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Edit Product Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleEditProductSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        value={productData.productName}
                                        onChange={handleProductInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={productData.description}
                                        onChange={handleProductInputChange}
                                        rows={3}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleProductInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={uploading}>
                                    {uploading ? "Submitting..." : "Update Product"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Add Product Modal */}
                    <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleAddProductSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        value={productData.productName}
                                        onChange={handleProductInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={productData.description}
                                        onChange={handleProductInputChange}
                                        rows={3}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleProductInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={uploading}>
                                    {uploading ? "Submitting..." : "Add Product"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Restaurant Modal */}
                    <Modal show={showEditRestaurantModal} onHide={() => setShowEditRestaurantModal(false
                    )}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Restaurant</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleEditRestaurantSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={restaurantData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={restaurantData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={restaurantData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={restaurantData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={uploading}>
                                    {uploading ? "Submitting..." : "Update Restaurant"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <p>No restaurant information found. Please add your restaurant details.</p>
            )}

            {message && <p className="mt-3 alert alert-info">{message}</p>}

            <p>New Order</p>
            {newOrder?.map((order) => (
                <div key={order.id}>
                    <p>Order ID: {order.id}</p>
               
                    <button>Accept</button>
                </div>
            ))}

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
                            <p><strong>Order Date:</strong> {notification.orderDate}</p>
                            <p><strong>Status :</strong> {notification.status}</p>
                            <p><strong>Total :</strong> {notification.total}</p>
                            {notification.orderDetails.map((details, index) => (
                                <div key={index} style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                                    <img src={details.restaurantMenuModel.imageUrl} alt={details.restaurantMenuModel.productName} style={{ width: "100px", height: "auto", borderRadius: "8px" }} />
                                    <div>
                                        <p><strong>Product Name:</strong> {details.restaurantMenuModel.productName}</p>
                                        <p><strong>Product Price:</strong> {details.price} RON</p>
                                        <p><strong>Quantity:</strong> {details.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => handleNotificationAction(notification.id, "accepted")}
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
                                onClick={() => handleNotificationAction(notification.id, "declined")}
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




            <h3>All Orders</h3>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Total</th>
                        <th>
                            
                            <Button
                                variant="link"
                                onClick={handleSort}
                                style={{ marginLeft: "10px", padding: "0" }}
                            >
                                Status
                            </Button>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            
                            <td>{order.total} RON</td>
                            <td>{order.status}</td>
                            <td>
                                <Button variant="primary" size="sm">
                                    View
                                </Button>{" "}
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default RestaurantDashboard;
