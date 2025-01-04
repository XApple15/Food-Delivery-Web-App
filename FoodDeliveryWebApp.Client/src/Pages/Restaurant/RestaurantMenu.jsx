import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../Context/cart.jsx';
import Cart from '../../Components/Cart.jsx';

//import truncateString from "../Utilities/TruncateString"; 
// not using anymore product description on all products page

function RestaurantMenu() {
    const { restaurant_id } = useParams(); 
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [showModal, setshowModal] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);

    const toggle = () => {
        setshowModal(!showModal);
    };

    useEffect(() => {
        console.log(restaurant_id);
        const actualId = restaurant_id.includes("=") ? restaurant_id.split("=")[1] : restaurant_id;

        axios
            .get(`https://localhost:7131/api/restaurantmenu?restaurantid=${actualId}`)
            .then((response) => {
                console.log(response.data);
                setMenus(response.data);
            })
            .catch((err) => console.log(err));
    }, [restaurant_id]);

    const handleClick = (menu) => {
        navigate(`/restaurantproduct/${menu.id}`);
    };

    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {menus.map(menu => (

                    <div key={menu.id} className="col">
                        <div className="card h-100">
                            <img src={menu.imageUrl} className="card-img-top" width="200" height="300" onClick={() => handleClick(menu)} />
                            <div key={menu.id} className="card-body" onClick={() => handleClick(menu)}>
                                <h5 className="card-title">{menu.productName}</h5>
                            </div>
                            <button className="btn btn-primary btn-lg" style={{ marginLeft: "60px", marginRight: "60px", marginBottom: "15px" }}
                                onClick={() => { addToCart(menu) }}>
                                Add to cart</button>
                            <div className="card-footer" onClick={() => handleClick(menu)}>
                                <small className="text-body-secondary">{menu.price} Lei</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default RestaurantMenu;