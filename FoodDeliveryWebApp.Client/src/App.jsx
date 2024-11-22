import { HashRouter as Router, Routes, Route } from "react-router-dom"; 
import NavBar from "./Components/NavBar"; 
import Home from "./Pages/Home";
import About from "./Pages/About";
import ClientLogin from "./Pages/Client/ClientLogin";
import AllProducts from "./Pages/AllProducts";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import Register from "./Pages/Client/Register";
import MyClientAccount from "./Pages/Client/MyClientAccount";
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from "./Context/PrivateRoute";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

function App() {
    return (
        <Router>
            <AuthProvider>      
                <NavBar  />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/allproducts" element={<AllProducts />} />
                    <Route path="/login" element={<ClientLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/admin" element={<AdminLogin />} />

                    <Route element={<PrivateRoute allowedRoles={['Admin']} />}>                        
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['Client']} />}>
                        <Route path="/account" element={<MyClientAccount />} />
                    </Route>
                   
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>    
    );
}

export default App;
