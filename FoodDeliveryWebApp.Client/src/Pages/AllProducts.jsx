
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../Context/cart.jsx';
import Cart from '../Components/Cart.jsx';

//import truncateString from "../Utilities/TruncateString"; 
// not using anymore product description on all products page

function AllProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showModal, setshowModal] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);

    const toggle = () => {
        setshowModal(!showModal);
    };

    useEffect(() => {
            axios
                .get("https://localhost:7131/api/Products")
                .then((response) => {
                    setProducts(response.data);
                })
                .catch((err) => console.log(err));
        },
        []);

    const handleClick = (product) => {
        navigate(`/products/${product.id}`);
    };

    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map(product => (
                    
                    <div  key={product.id} className="col">
                        <div className="card h-100">
                            <img src={product.productImageURL} className="card-img-top" width="200" height="300" onClick={() => handleClick(product)} />
                            <div key={product.id} className="card-body" onClick={() => handleClick(product)}>
                                <h5 className="card-title">{product.name}</h5>
                            </div>
                            <button className="btn btn-primary btn-lg" style={{ marginLeft: "60px" , marginRight:"60px" ,marginBottom:"15px"} }
                                onClick={() => {addToCart(product)}}>
                                Add to cart</button>
                            <div className="card-footer" onClick={() => handleClick(product)}>
                                <small className="text-body-secondary">{product.price} Lei</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default AllProducts;