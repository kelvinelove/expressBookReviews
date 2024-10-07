const express = require('express');
let books = require('./booksdb');
let users = require('./auth_users').users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the list of all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const titleBooks = Object.values(books).filter(book => book.title === req.params.title);
    if (titleBooks.length > 0) {
        return res.status(200).json(titleBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
