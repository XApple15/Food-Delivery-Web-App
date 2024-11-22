import PropTypes from 'prop-types'
import { useContext } from 'react'
import { CartContext } from '../Context/cart.jsx'
import './Cart.css' 

export default function Cart({ showModal, toggle }) {
    const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext)

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
                                <img src={item.thumbnail} alt={item.title} className="cart-item-image" />
                                <div>
                                    <h2 className="item-title">{item.title}</h2>
                                    <p className="item-price">${item.price}</p>
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
