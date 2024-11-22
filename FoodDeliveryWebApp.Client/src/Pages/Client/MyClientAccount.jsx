import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function MyClientAccount() {
    const [activeContent, setActiveContent] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users,setUsers] = useState([]);

    const handleItemClick = (content) => {
        setActiveContent(content);
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
                                <div>
                                    <h6>Users:</h6>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <div key={user.id}>
                                                <p><strong>ID:</strong> {user.id}</p> {/* Display the id */}
                                                <p><strong>Name:</strong> {user.name || "No name provided"}</p> {/* Handle null name */}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No users found.</p>
                                    )}
                                </div>                            </div>
                )}
            </div>
        )
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
                    axios
                        .get("https://localhost:7131/api/Client")
                        .then((response) => {
                            setUsers(response.data);
                            console.log(response.data);
                        })
                        .catch((err) => console.log(err));
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
    }, []);

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
