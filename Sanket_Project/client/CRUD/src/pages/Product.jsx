import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", category_id: "" });
    const [editId, setEditId] = useState(null);

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await axios.put(`http://localhost:5000/api/products/${editId}`, formData);
        } else {
            await axios.post("http://localhost:5000/api/products", formData);
        }
        setFormData({ name: "", category_id: "" });
        setEditId(null);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

    const handleEdit = (product) => {
        setFormData({ name: product.ProductName, category_id: product.CategoryId });
        setEditId(product.ProductId);
    };

    return (
        <>
        <Navbar/>
        <div className="container mt-5">
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editId ? "Update" : "Add"} Product
                </button>
            </form>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.ProductId}>
                            <td>{product.ProductId}</td>
                            <td>{product.ProductName}</td>
                            <td>{product.CategoryName}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(product.ProductId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default Product;
