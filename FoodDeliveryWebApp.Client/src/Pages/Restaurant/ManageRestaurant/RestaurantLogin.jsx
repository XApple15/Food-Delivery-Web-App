import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../Context/AuthContext';


function RestaurantLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("ursu@gmail.com");
    const [password, setPassword] = useState("String1!");
    const [error, setError] = useState("");
    const auth = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();

        const loginPayload = {
            email: email,
            password: password,
            role: "Restaurant"
        };

        if (loginPayload.email && loginPayload.password) {
            try {
                const result = await auth.loginAction(loginPayload);
                //console.log(loginPayload);
                if (result === 200) {
                    navigate("/restaurant/dashboard");
                } else {
                    setError("Please check your credentials");
                }
            } catch (error) {
                setError("An error occurred. Please try again.");
            }
        } else {
            setError("Please enter a username and password.");
        }
    }
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Restaurant Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input
                                type="email"
                                className="form-control form-control-sm"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-sm"
                                id="exampleInputPassword1"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="exampleCheck1"
                            />
                            <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RestaurantLogin;