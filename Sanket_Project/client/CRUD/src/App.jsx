import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/Category";
import Product from "./pages/Product";
import ProductDisplay from "./pages/ProductDisplay";
import Home from "./pages/Home";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/categories" element={<Category />} />
                <Route path="/home" element={<Home/>}/>
                <Route path="/products" element={<Product />} />
                <Route path="/products/display" element={<ProductDisplay />} />
            </Routes>
        </Router>
    );
}

export default App;
