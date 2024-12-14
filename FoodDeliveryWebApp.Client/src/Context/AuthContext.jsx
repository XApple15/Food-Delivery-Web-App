import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { decodeJwt, isTokenExpired } from './RetrieveDataFromJWT';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired(token)) {     
                logout();
            } else {       
                const decoded = decodeJwt(token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(decoded);
                setUserId(decoded.id);
                setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                console.log(user);
            }
        }
        setLoading(false);
    }, []);

    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            logout(); 
        }
    };

    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, []);

    const loginAction = async (data) => {
        let statusCode = 500;
        try {
            const loginPayload = {
                email: data.email,
                password: data.password,
                role : data.role
            };
            await   axios
                .post("https://localhost:7131/api/Auth/Login", loginPayload)
                .then((response) => {
                    const token = response.data.jwtToken;
                    localStorage.setItem("token", token);
                    setToken(token);
                    const decoded = decodeJwt(token);
                    setUser(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims"]);

                    setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                   
                    setUserId(decoded.id);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    statusCode = response.status;
                })
                .catch((err) => {        
                    console.log(err);
                    statusCode = 500;
                });
        }
        catch (error){
            console.log(error);     
            statusCode = 500;
        }
        return statusCode;
    };

    const logout = () => {
        setToken("");
        localStorage.removeItem('token');
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setRole(null);
        setUserId(null);
        navigate('/');
    };

    

    return (
        <AuthContext.Provider value={{ token,user, loginAction, logout,role ,userId}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
