const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/books'); 
    const data = response.data;
    res.status(200).json(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`); 
    const book = response.data;

    if (book) {
      res.status(200).json(JSON.stringify(book, null, 2));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:3000/books/author/${author}`); 
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      res.status(200).json(JSON.stringify(booksByAuthor, null, 2));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:3000/books/title/${title}`); 
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      res.status(200).json(JSON.stringify(booksByTitle, null, 2));
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

public_users.get('/', async function (req, res) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.status(200).json(JSON.stringify(books, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = books.find(book => book.isbn === isbn);
    if (book) {
      res.status(200).json(JSON.stringify(book, null, 2));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = books.filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length > 0) {
      res.status(200).json(JSON.stringify(booksByAuthor, null, 2));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
      res.status(200).json(JSON.stringify(booksByTitle, null, 2));
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;
