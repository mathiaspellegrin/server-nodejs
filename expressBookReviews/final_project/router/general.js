const express = require('express');
let books = require("./booksdb.js"); 
const public_users = express.Router();

public_users.get('/', function (req, res) {
  res.json(books);
});

public_users.get('/isbn/:id', function (req, res) {
  const id = req.params.id; 
  const book = books[id]; 
  
  if (book) {
    res.status(200).json(book); 
  } else {
    res.status(404).json({ message: "Book not found" }); 
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" }); 
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
