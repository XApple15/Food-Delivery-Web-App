import { HashRouter as Router, Routes, Route } from "react-router-dom"; 
import NavBar from "./Components/NavBar"; 
import Home from "./Pages/Home";
import About from "./Pages/About";
import ClientLogin from "./Pages/Client/ClientLogin";
import AllRestaurants from "./Pages/Restaurant/AllRestaurants";
import RestaurantMenu from "./Pages/Restaurant/RestaurantMenu";
import RestaurantProduct from "./Pages/Restaurant/RestaurantProduct";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import Register from "./Pages/Client/Register";
import MyClientAccount from "./Pages/Client/MyClientAccount";
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from "./Context/PrivateRoute";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ImageUpload from "./Pages/ImageUpload";
import RestaurantLogin from "./Pages/Restaurant/ManageRestaurant/RestaurantLogin";
import RestaurantDashboard from "./Pages/Restaurant/ManageRestaurant/RestaurantDashboard";
import AdminUserDashboard from "./Pages/Admin/AdminUserDashboard";
import AdminRestaurantDashboard from "./Pages/Admin/AdminRestaurantDashboard";
import CheckOutPage from "./Pages/Client/CheckOutPage";
import CourierLogin from "./Pages/Courier/CourierLogin";
import CourierDashbord from "./Pages/Courier/CourierDashboard";

function App() {
    return (
        <Router>
            <AuthProvider>      
                <NavBar />
                <br />
                <br />
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
                    <Route path="/courier/login" element={<CourierLogin />} /> 

                    <Route element={<PrivateRoute allowedRoles={['Restaurant']} />}>
                        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} /> 
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard/users" element={<AdminUserDashboard />} />
                        <Route path="/admin/dashboard/restaurants" element={<AdminRestaurantDashboard />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['Client']} />}>
                        <Route path="/account" element={<MyClientAccount />} />
                        <Route path="/check-out" element={<CheckOutPage />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={['Courier']} />}>
                        <Route path="/courier/dashboard" element={<CourierDashbord />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
                <br />
                <br />
                <br />
                <br />
            </AuthProvider>
        </Router>    
    );
}

export default App;
