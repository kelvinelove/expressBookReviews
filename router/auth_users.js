const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb');
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if the username and password are correct
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid login credentials" });
    }

    const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken: token };

    return res.status(200).json({ message: "User successfully logged in", token });
});

// Add or edit a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews[req.user.username] = review;
    return res.status(200).json({ message: "Review added or modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews[req.user.username]) {
        return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    delete book.reviews[req.user.username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
