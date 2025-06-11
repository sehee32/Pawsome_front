import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import MyPage from "./pages/MyPage";
import OrderPage from "./pages/OrderPage";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin" element={<AdminDashboard />}/>
                        <Route path="/cart" element={<Cart />}/>
                        <Route path="/mypage" element={<MyPage />}/>
                        <Route path="/order" element={<OrderPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}
export default App;
