import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
    const navigate = useNavigate();
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary mx-2" onClick={() => navigate(`/admin/dashboard/users`)}>
                    User Dashboard
                </button>
                <button className="btn btn-secondary mx-2" onClick={() => navigate(`/admin/dashboard/restaurants`)}>
                    Restaurant Dashboard
                </button>
                <button className="btn btn-success mx-2" onClick={() => navigate(`/admin/dashboard/orders`)}>
                    Order Dashboard
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
