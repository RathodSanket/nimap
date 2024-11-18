import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "" });
    const [editId, setEditId] = useState(null);

    const fetchCategories = async () => {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await axios.put(`http://localhost:5000/api/categories/${editId}`, formData);
        } else {
            await axios.post("http://localhost:5000/api/categories", formData);
        }
        setFormData({ name: "" });
        setEditId(null);
        fetchCategories();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name });
        setEditId(category.id);
    };

    return (
        <div className="container mt-5">
            <h2>Category Management</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editId ? "Update" : "Add"} Category
                </button>
            </form>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(category)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(category.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Category;
