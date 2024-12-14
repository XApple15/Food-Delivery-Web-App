
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../Context/cart.jsx';
import Cart from '../Components/Cart.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
//import truncateString from "../Utilities/TruncateString"; 
// not using anymore product description on all products page

function AllRestaurants() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [showModal, setshowModal] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);

    const toggle = () => {
        setshowModal(!showModal);
    };

    useEffect(() => {
            axios
                .get("https://localhost:7131/api/Restaurant")
                .then((response) => {
                    setRestaurants(response.data);
                    console.log(response.data);
                })
                .catch((err) => console.log(err));
        },
        []);

    const handleClick = (restaurant) => {
        navigate(`/restaurantmenu/restaurant_id=${restaurant.id}`);
    };

    return (
        <div className="d-flex flex-column align-items-center">
            {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="mb-3">

                    <div
                        className="card"
                        style={{ width: "50vw", height: "200px" }} // Fixed width and height
                        onClick={() => handleClick(restaurant)}
                    >
                        <div className="row g-0 h-100">
                            <div className="col-md-4">
                                <img
                                    src={restaurant.imageUrl}
                                    className="img-fluid rounded-start h-100"
                                    alt={restaurant.name}
                                    style={{ objectFit: "cover" }} // Ensures image fits properly
                                />
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">{restaurant.description}</p>
                                    <p className="card-text">
                                        <small className="text-body-secondary">{restaurant.rating}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );



}


export default AllRestaurants;