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
    const [newMenuItem, setNewMenuItem] = useState({
        productName: "",
        description: "",
        price: "",
        imageUrl: "",
        restaurantId: ""
    });
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [showEditMenuModal, setShowEditMenuModal] = useState(false);
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [imageFile, setImageFile] = useState(null);


    const itemsPerPage = 5;

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("https://localhost:7131/api/restaurant");
                setRestaurants(response.data || []);
            } catch (err) {
                console.error("Failed to fetch restaurants", err);
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const handleEdit = async (restaurant) => {
        setSelectedRestaurant({ ...restaurant });
        setShowModal(true);
        setMenuItems([]);
        const actualId = restaurant.id.includes("=") ? restaurant.id.split("=")[1] : restaurant.id;

        try {
            const response = await axios.get(`https://localhost:7131/api/restaurantmenu?restaurantid=${actualId}`);
           
            setMenuItems(response.data || []);
            
        } catch (err) {
            console.error("Failed to fetch menu items", err);
            setMenuItems([]);
        }
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
            let imageUrl = selectedRestaurant.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            }

            selectedRestaurant.imageUrl = imageUrl;

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
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
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

    const handleEditMenu = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowEditMenuModal(true);
    };

    const handleMenuInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedMenuItem({ ...selectedMenuItem, [name]: value });
    };

    const handleNewMenuInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem({ ...newMenuItem, [name]: value });
    };


    const handleSaveMenu = async () => {
        try {
            let imageUrl = selectedMenuItem.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            }

            selectedMenuItem.imageUrl = imageUrl;

            await axios.put(`https://localhost:7131/api/restaurantmenu/${selectedMenuItem.id}`, selectedMenuItem);
            setMenuItems(menuItems.map((item) => item.id === selectedMenuItem.id ? selectedMenuItem : item));
            setShowEditMenuModal(false);
            setImageFile(null);
            triggerToast("Menu item updated successfully.");
        } catch (err) {
            console.error("Failed to save menu item", err);
        }
    };

    const handleNewRestaurant = async () => {
        try {
            let imageUrl = newRestaurant.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            } 
            newRestaurant.imageUrl = imageUrl;

            await axios.post(`https://localhost:7131/api/restaurant`, newRestaurant);
            setShowAddModal(false);
            triggerToast("Restaurant created successfully.");
            setNewRestaurant({ 
                name: "",
                address: "",
                phoneNumber: "",
                description: "",
                rating: "",
                imageUrl: "",
                applicationUserId: ""
            });
        } catch (err) {
            console.error("Failed to create restaurant", err);
        }
    };

    const handleAddMenu = () => {
        setSelectedMenuItem(null);
        setShowAddMenuModal(true);
    };

    const handleAddMenuItem = async () => {
        try {
            let imageUrl = newRestaurant.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("fileName", imageFile.name);

                const uploadResponse = await axios.post("https://localhost:7131/api/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadResponse.data.filePath;
            }
            newMenuItem.imageUrl = imageUrl;

            newMenuItem.restaurantId = selectedRestaurant.id;
            const response = await axios.post("https://localhost:7131/api/restaurantmenu", newMenuItem);
            setMenuItems([...menuItems, response.data]);
            setShowAddMenuModal(false);
            setImageFile(null);
            setNewMenuItem({
                productName: "",
                description: "",
                price: "",
                imageUrl: "",
                restaurantId: ""
            });
            triggerToast("New menu item added successfully.");
        } catch (err) {
            console.error("Failed to add new menu item", err);
        }
    };

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


            {/* New Restaurant Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>  
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newRestaurant?.name || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={newRestaurant?.address || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={newRestaurant?.phoneNumber || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newRestaurant?.description || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="text"
                                name="rating"
                                value={newRestaurant?.rating || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Application User ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="applicationUserId"
                                value={newRestaurant?.applicationUserId || ""}
                                onChange={handleAddInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleNewRestaurant}>
                        Add Restaurant
                    </Button>
                </Modal.Footer>
            </Modal>


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
                            <td>
                                <img
                                    src={restaurant.imageUrl}
                                    alt={restaurant.name}
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                />
                            </td>
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

            {/* Edit Restaurant Modal */}
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
                                type="text"
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
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>

                    {/* Menu Table */}
                    <h5 className="mt-4">Menu Items</h5>
                    <Table bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map((menuItem) => (
                                <tr key={menuItem.id}>
                                    <td>{menuItem.id}</td>
                                    <td>{menuItem.productName}</td>
                                    <td>{menuItem.description}</td>
                                    <td>{menuItem.price}</td>
                                    <td>
                                        <Button variant="warning" size="sm" onClick={() => handleEditMenu(menuItem)}>
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Button variant="success" onClick={handleAddMenu}>
                        Add New Menu Item
                    </Button>
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

            {/* Add Menu Modal */}
            <Modal show={showAddMenuModal} onHide={() => setShowAddMenuModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={newMenuItem?.productName || ""}
                                onChange={handleNewMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newMenuItem?.description || ""}
                                onChange={handleNewMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={newMenuItem?.price || ""}
                                onChange={handleNewMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddMenuModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddMenuItem}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Menu Modal */}
            <Modal show={showEditMenuModal} onHide={() => setShowEditMenuModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={selectedMenuItem?.productName || ""}
                                onChange={handleMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={selectedMenuItem?.description || ""}
                                onChange={handleMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={selectedMenuItem?.price || ""}
                                onChange={handleMenuInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditMenuModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveMenu}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast Notification */}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{ position: "absolute", top: 10, right: 10 }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
}

export default AdminRestaurantDashboard;
