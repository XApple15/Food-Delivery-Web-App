import { HashRouter as Router, Routes, Route } from "react-router-dom"; 
import NavBar from "./Components/NavBar"; 
import Home from "./Pages/Home";
import About from "./Pages/About";
import ClientLogin from "./Pages/Client/ClientLogin";
import AllRestaurants from "./Pages/AllRestaurants";
import RestaurantMenu from "./Pages/RestaurantMenu";
import RestaurantProduct from "./Pages/RestaurantProduct";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import Register from "./Pages/Client/Register";
import MyClientAccount from "./Pages/Client/MyClientAccount";
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from "./Context/PrivateRoute";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ImageUpload from "./Pages/ImageUpload";
import RestaurantLogin from "./Pages/Restaurant/RestaurantLogin";
import RestaurantUserDashboard from "./Pages/Restaurant/RestaurantUserDashboard";
import RestaurantDashboard from "./Pages/Restaurant/RestaurantDashboard";

function App() {
    return (
        <Router>
            <AuthProvider>      
                <NavBar  />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/allrestaurants" element={<AllRestaurants />} />
                    <Route path="/login" element={<ClientLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/restaurantmenu/:restaurant_id" element={<RestaurantMenu />}/>
                    <Route path="/restaurantproduct/:id" element={ <RestaurantProduct/>} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/upload" element={<ImageUpload />} /> 
                    <Route path="/restaurant/login" element={<RestaurantLogin />} />

                    <Route element={<PrivateRoute allowedRoles={['Restaurant']} />}>
                        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} /> 
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard/users" element={<AdminUserDashboard />} />
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
