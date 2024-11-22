import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, InputGroup, Toast, Pagination } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://localhost:7131/api/applicationuser");
                setUsers(response.data || []);
                console.log(response.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        console.log(user.username);
        setSelectedUser({ ...user });
        setShowModal(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                console.log(userId);
                await axios.delete(`https://localhost:7131/api/applicationuser/${userId}`);
                setUsers(users.filter((user) => user.id !== userId));
                triggerToast("User deleted successfully.");
            } catch (err) {
                console.error("Failed to delete user", err);
            }
        }
    };

    const handleSave = async () => {
        try {
            
            await axios.put(`https://localhost:7131/api/applicationuser/${selectedUser.id}`, selectedUser);
            setUsers(users.map((user) =>
                user.id === selectedUser.id ? selectedUser : user
            ));
            setShowModal(false);

            triggerToast("User updated successfully.");
        } catch (err) {
            console.error("Failed to save user", err);
        }
    };

    const handleRegister = async () => {
        try {

        } catch (err) {
            console.error("Failed register");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
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

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const filteredUsers = sortedUsers.filter((user) =>
    (user.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        user.email?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
        user.role?.toLowerCase().includes(searchQuery?.toLowerCase() || ''))

    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Users</h1>

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search users by name, email, or role"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>

            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th onClick={() => handleSort("name")}>
                            Username {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("email")}>
                            Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th>Name</th>
                        <th >Phone Number </th>
                        <th>Address </th>
                        <th>Role</th>
                        <th>Normal User Data</th>
                        <th>Admin Data</th>
                        <th>Courier Data</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.id} onClick={() => handleEdit(user)}>
                            <td>{user.id}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                            <td>{user.normalUserData}</td>
                            <td>{user.adminData}</td>
                            <td>{user.courierData}</td>

                            <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <Button
                                    style={{ marginRight: "10px" }}
                                    variant="warning"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(user);
                                    }}
                                >
                                    Edit
                                </Button>{" "}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(user.id);
                                    }}
                                >
                                    Delete
                                    </Button>
                                </div>
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

            {/* Modal for editing user */}
            {selectedUser && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="userName"
                                    value={selectedUser.userName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phoneNumber"
                                    value={selectedUser.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={selectedUser.address}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Client">Client</option>
                                    <option value="Courier">Courier</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Normal User Data</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="normalUserData"
                                    value={selectedUser.normalUserData}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Admin Data</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="adminData"
                                    value={selectedUser.adminData}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Courier Data</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="courierData"
                                    value={selectedUser.courierData}
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
            )}

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

export default AdminDashboard;
