import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from '../../Context/cart.jsx';
import Cart from '../../Components/Cart.jsx';

function RestaurantProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cartItems, addToCart } = useContext(CartContext);

    const toggle = () => {
        setshowModal(!showModal);
    };

    useEffect(() => {
        console.log(id);
        axios
            .get(`https://localhost:7131/api/restaurantmenu/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.productImageURL} alt={product.name} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <h1 className="display-4">{product.name}</h1>
                    <p className="lead">{product.description}</p>
                    <h4 className="text-success">${product.price}</h4>
                    <div className="mt-4">
                        <button className="btn btn-primary btn-lg" onClick={() => { addToCart(product) }}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <h4>Product Details</h4>
                    <ul className="list-group">
                        <li className="list-group-item">Color: {product.price}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default  RestaurantProduct;
