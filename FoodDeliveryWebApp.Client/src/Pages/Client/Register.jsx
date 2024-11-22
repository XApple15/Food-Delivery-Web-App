import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [username, setUserName] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [adrress, setAddress] = useState("");
    

	function handleSubmit(event) {
		event.preventDefault();

		if(password !== passwordConfirm) {
			setError("Passwords do not match.");
			return;
		}
        const registerPayload = {
            email: email,
            password: password,
            username: username,
            phoneNumber: phonenumber,
            address: adrress,
            roles: ["Client"]
        };
        //console.log(registerPayload);
		axios
			.post("https://localhost:7131/api/Auth/Register", registerPayload)
			.then((response) => {
                setSuccess("Registration successful. Please log in.");
                setError("");
			})
			.catch((err) => {
                console.error(err);
                setSuccess("");
				setError("Registration failed.");
			});
	}
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }
    function handlePasswordConfirmChange(event) {
        setPasswordConfirm(event.target.value);
    }
    function handleUserNameChange(event) {
        setUserName(event.target.value);
    }
    function handlePhoneNumberChange(event) {
        setPhoneNumber(event.target.value);
    }
    function handleAddressChange(event) {
        setAddress(event.target.value);
    }


    function redirectLogin() {
        navigate('/login');
    }

	return (
        <div className="container mt-4">
            <h2 className="text-center">Register</h2>
            {error && <div className="alert alert-danger" style={{ textAlign: 'center', marginTop: '16px' }}>{error}</div>}
            {success &&
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <div className="alert alert-success">{success}</div>
                    <button className="btn btn-primary btn-sm" onClick={redirectLogin}>Login</button>
                </div>
            }
            {!success &&
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control form-control-sm"
                                    id="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-sm"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-sm"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={passwordConfirm}
                                    onChange={handlePasswordConfirmChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">UserName</label>
                                <input
                                    className="form-control form-control-sm"
                                    id="username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={handleUserNameChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Phone Number</label>
                                <input
                                    className="form-control form-control-sm"
                                    id="phonenumber"
                                    placeholder="Enter phone number"
                                    value={phonenumber}
                                    onChange={handlePhoneNumberChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Address</label>
                                <input
                                    className="form-control form-control-sm"
                                    id="address"
                                    placeholder="Enter address"
                                    value={adrress}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
	);
}

export default Register;