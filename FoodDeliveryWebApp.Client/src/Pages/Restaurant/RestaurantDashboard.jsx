import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '../../Context/AuthContext';
function RestaurantDashboard() {
    const { userId } = useAuth(); // Destructuring to get userId
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        imageUrl: "",
        applicationuserid: userId
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

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
            let imageUrlAux = "";

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrlAux = uploadResponse.data.filePath ; // Assuming API returns { imageUrl }
            }
           
            const updatedRestaurantData = {
                ...restaurantData,
                imageUrl: imageUrlAux,
                applicationuserid: userId
            };
            
            const response = await axios.post("https://localhost:7131/api/restaurant", updatedRestaurantData);
            setMessage("Restaurant created successfully!");
            setRestaurantData({
                name: "",
                address: "",
                phoneNumber: "",
                description: "",
                imageUrl: "",
                applicationuserid: ""
            });
            setImageFile(null);
        } catch (error) {
            console.error("Failed to create restaurant", error);
            setMessage("Failed to create restaurant.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Create Restaurant</h1>
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
                    {uploading ? "Submitting..." : "Create Restaurant"}
                </Button>
            </Form>
            {message && <p className="mt-3">{message}</p>}
        </Container>
    );
}

export default RestaurantDashboard;
