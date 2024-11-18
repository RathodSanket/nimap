const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_jwt_secret";

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "InventoryDB",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database!");
});

// User registration
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO Users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
        if (err) return res.status(400).send(err);
        res.send({ message: "User registered successfully!" });
    });
});

// User login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM Users WHERE username = ?", [username], async (err, results) => {
        if (err || results.length === 0) return res.status(400).send("User not found!");

        const isValid = await bcrypt.compare(password, results[0].password);
        if (!isValid) return res.status(401).send("Invalid credentials!");

        const token = jwt.sign({ id: results[0].id }, SECRET_KEY);
        res.send({ token });
    });
});

// CRUD for Categories
app.get("/api/categories", (req, res) => {
    db.query("SELECT * FROM Categories", (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.post("/api/categories", (req, res) => {
    const { name } = req.body;

    db.query("INSERT INTO Categories (name) VALUES (?)", [name], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Category added successfully!" });
    });
});

app.put("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    db.query("UPDATE Categories SET name = ? WHERE id = ?", [name, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Category updated successfully!" });
    });
});

app.delete("/api/categories/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM Categories WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Category deleted successfully!" });
    });
});

// CRUD for Products
app.get("/api/products", (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    db.query(
        `SELECT Products.id AS ProductId, Products.name AS ProductName, Categories.id AS CategoryId, Categories.name AS CategoryName 
         FROM Products 
         JOIN Categories ON Products.category_id = Categories.id 
         LIMIT ?, ?`,
        [parseInt(offset), parseInt(pageSize)],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
});

app.post("/api/products", (req, res) => {
    const { name, category_id } = req.body;

    db.query("INSERT INTO Products (name, category_id) VALUES (?, ?)", [name, category_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Product added successfully!" });
    });
});

app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, category_id } = req.body;

    db.query("UPDATE Products SET name = ?, category_id = ? WHERE id = ?", [name, category_id, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Product updated successfully!" });
    });
});

app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM Products WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Product deleted successfully!" });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
