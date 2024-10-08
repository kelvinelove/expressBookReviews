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
public_users.get('/', async (req, res) => {
    try {
        const books = await getAllBooks(); // Using async callback function
        res.status(200).json(JSON.stringify(books, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

async function getAllBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books available");
        }
    });
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then(book => res.status(200).json(book))
        .catch(err => res.status(404).json({ message: err }));
});

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
}


// Get books by author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const result = await getBooksByAuthor(author);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

async function getBooksByAuthor(author) {
    return Object.values(books).filter(book => book.author === author);
}


// Get books by title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const result = await getBooksByTitle(title);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No books found for this title" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

async function getBooksByTitle(title) {
    return Object.values(books).filter(book => book.title === title);
}


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
