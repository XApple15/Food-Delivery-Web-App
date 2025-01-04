import PropTypes from 'prop-types'
import { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { CartContext } from '../Context/cart.jsx'
import './Cart.css' 

export default function Cart({ showModal, toggle }) {
    const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext)
    const navigate = useNavigate();

    const navigateToCheckOut = () => {
        toggle();
        navigate('/check-out');
    };

    return (
        showModal && (
            <div className="cart-modal">
                <h1 className="cart-title">Cart</h1>
                <div className="close-button">
                    <button onClick={toggle}>Close</button>
                </div>
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-info">
                                <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                                <div>
                                    <h2 className="item-title">{item.productName}</h2>
                                    <p className="item-price">Ron {item.price}</p>
                                </div>
                            </div>
                            <div className="cart-item-controls">
                                <button onClick={() => addToCart(item)}>+</button>
                                <p>{item.quantity}</p>
                                <button onClick={() => removeFromCart(item)}>-</button>
                            </div>
                        </div>
                    ))}
                </div>
                {cartItems.length > 0 ? (
                    <div className="cart-total">
                        <h2>Total: ${getCartTotal()}</h2>
                        <button onClick={clearCart}>Clear cart</button>
                        <button onClick={navigateToCheckOut} type="button">Check-out</button>
                    </div>

                ) : (
                    <h2 className="empty-cart">Your cart is empty</h2>
                )}
            </div>
        )
    )
}

Cart.propTypes = {
    showModal: PropTypes.bool,
    toggle: PropTypes.func
}
