import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, InputGroup, Toast, Pagination } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminRestaurantDashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        rating: "",
        imageUrl: "",
        applicationUserId: ""
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("https://localhost:7131/api/restaurant");
                setRestaurants(response.data || []);
                console.log(response.data);
            } catch (err) {
                console.error("Failed to fetch restaurants", err);
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const handleEdit = (restaurant) => {
        setSelectedRestaurant({ ...restaurant });
        setShowModal(true);
    };

    const handleDelete = async (restaurantId) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            try {
                await axios.delete(`https://localhost:7131/api/restaurant/${restaurantId}`);
                setRestaurants(restaurants.filter((restaurant) => restaurant.id !== restaurantId));
                triggerToast("Restaurant deleted successfully.");
            } catch (err) {
                console.error("Failed to delete restaurant", err);
            }
        }
    };

    const handleSave = async () => {
        try {
            console.log(selectedRestaurant);
            await axios.put(`https://localhost:7131/api/restaurant/${selectedRestaurant.id}`, selectedRestaurant);
            setRestaurants(restaurants.map((restaurant) =>
                restaurant.id === selectedRestaurant.id ? selectedRestaurant : restaurant
            ));
            setShowModal(false);
            triggerToast("Restaurant updated successfully.");
        } catch (err) {
            console.error("Failed to save restaurant", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedRestaurant({ ...selectedRestaurant, [name]: value });
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewRestaurant({ ...newRestaurant, [name]: value });
    };

    const handleAddRestaurant = async () => {
        try {
            const response = await axios.post("https://localhost:7131/api/restaurant", newRestaurant);
            setUsers([...restaurants, response.data]);
            setShowAddModal(false);
            triggerToast("New restaurant added successfully.");
            setNewRestaurant({
                id: "",
                name: "",
                address: "",
                phoneNumber: "",
                description: "",
                rating: "",
                imageUrl: "",
                applicationUserId: ""
            });
        } catch (err) {
            console.error("Failed to add new restaurant", err);
        }
    };

    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedRestaurants = [...restaurants].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const paginatedRestaurants = sortedRestaurants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedRestaurants.length / itemsPerPage);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Restaurants</h1>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search restaurants by name"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>

            <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
                Add New Restaurant
            </Button>

            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th onClick={() => handleSort("name")}>
                            Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th>Address</th>
                        <th>PhoneNumber</th>
                        <th>Description</th>
                        <th>Rating</th>
                        <th>ImageUrl</th>
                        <th>Application User ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedRestaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <td>{restaurant.id}</td>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.address}</td>
                            <td>{restaurant.phoneNumber}</td>
                            <td>{restaurant.description}</td>
                            <td>{restaurant.rating}</td>
                            <td>{restaurant.imageUrl}</td>
                            <td>{restaurant.applicationUserId}</td>
                            
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(restaurant)}>
                                    Edit
                                </Button>{" "}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(restaurant.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => setCurrentPage(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Edit User */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Id</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={selectedRestaurant?.id || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={selectedRestaurant?.name || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="restaurant"
                                name="address"
                                value={selectedRestaurant?.address || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={selectedRestaurant?.phoneNumber || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={selectedRestaurant?.description || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="text"
                                name="rating"
                                value={selectedRestaurant?.rating || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ImageUrl</Form.Label>
                            <Form.Control
                                type="text"
                                name="imageUrl"
                                value={selectedRestaurant?.imageUrl || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>






            {/* Add User */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newRestaurant?.name || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="restaurant"
                                name="address"
                                value={newRestaurant?.address || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={newRestaurant?.phoneNumber || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newRestaurant?.description || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="text"
                                name="rating"
                                value={newRestaurant?.rating || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ImageUrl</Form.Label>
                            <Form.Control
                                type="text"
                                name="imageUrl"
                                value={newRestaurant?.imageUrl || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddRestaurant}>
                        Add Restaurant
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
}

export default AdminRestaurantDashboard;
