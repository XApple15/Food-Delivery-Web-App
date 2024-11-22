import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { CartProvider } from './context/cart.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CartProvider>
            <App />
        </CartProvider>
    </StrictMode>,
)
    