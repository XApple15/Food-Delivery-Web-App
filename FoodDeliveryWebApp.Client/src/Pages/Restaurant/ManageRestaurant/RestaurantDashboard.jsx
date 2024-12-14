import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Modal, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../Context/AuthContext";

function RestaurantDashboard() {
    const { userId } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        imageUrl: "",
        rating: "5",
        applicationuserid: userId,
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`https://localhost:7131/api/restaurant?applicationUserId=${userId}`);
                setRestaurant(response.data[0]);
                if (response.data[0]) {
                    setRestaurantData({
                        name: response.data[0].name,
                        address: response.data[0].address,
                        phoneNumber: response.data[0].phoneNumber,
                        description: response.data[0].description,
                        imageUrl: response.data[0].imageUrl,
                        rating: response.data[0].rating,
                        applicationuserid: userId,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch restaurant", error);
            }
        };
        fetchRestaurant();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData({ ...restaurantData, [name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage("");

        try {
            let imageUrlAux = restaurant.imageUrl;

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrlAux = uploadResponse.data.filePath;
            }

            const updatedRestaurantData = {
                ...restaurantData,
                imageUrl: imageUrlAux,
                applicationuserid: userId,
            };

            const response = await axios.put(`https://localhost:7131/api/restaurant/${restaurant.id}`, updatedRestaurantData);
            setMessage("Restaurant updated successfully!");
            setRestaurant(response.data);
            setShowModal(false);
        } catch (error) {
            console.error("Failed to update restaurant", error);
            setMessage("Failed to update restaurant.");
        } finally {
            setUploading(false);
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
                                    style={{ maxWidth: '10%', maxHeight: '300px', objectFit: 'cover' }}
                                    src={restaurant.imageUrl}
                                    alt="Restaurant Image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Edit Restaurant
                    </Button>
                </>
            ) : (
                <p>No restaurant found. Create one!</p>
            )}

            {!restaurant && (
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add New Restaurant
                </Button>
            )}

            {/* edit/ add restaurant */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{restaurant ? "Edit Restaurant" : "Create Restaurant"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
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
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" disabled={uploading}>
                            {uploading ? "Submitting..." : restaurant ? "Update Restaurant" : "Create Restaurant"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {message && <p className="mt-3">{message}</p>}
        </Container>
    );
}

export default RestaurantDashboard;
