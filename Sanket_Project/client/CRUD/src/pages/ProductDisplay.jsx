import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // Adjust page size as needed

    const fetchProducts = async () => {
        const response = await axios.get(`http://localhost:5000/api/products?page=${page}&pageSize=${pageSize}`);
        setProducts(response.data);
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleNext = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <>
        <Navbar/>
        <div className="container mt-5">
            <h2>Product List</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Category ID</th>
                        <th>Category Name</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.ProductId}>
                            <td>{product.ProductId}</td>
                            <td>{product.ProductName}</td>
                            <td>{product.CategoryId}</td>
                            <td>{product.CategoryName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handlePrevious} disabled={page === 1}>
                    Previous
                </button>
                <button className="btn btn-secondary" onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
        </>
    );
};

export default ProductDisplay;
