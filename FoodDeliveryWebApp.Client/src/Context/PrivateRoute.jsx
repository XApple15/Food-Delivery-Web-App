import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// preventing unauthorized access to certain pages

const PrivateRoute = ({ allowedRoles }) => {
    const user = useAuth();
   
    if (!user.token) return <Navigate to="/" />;
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }   
    return <Outlet />;
};

export default PrivateRoute;