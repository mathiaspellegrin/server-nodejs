const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  if (user) {
    return user.password === password;
  }
  return false;
};

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
  req.session.token = token; 

  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.body.review;
  const username = req.user.username; 

  const book = books[isbn]; 

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!Array.isArray(book.reviews)) {
    book.reviews = []; 
  }

  let review = book.reviews.find(review => review.username === username);

  if (review) {
    review.text = reviewText;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    book.reviews.push({ username, text: reviewText });
    return res.status(200).json({ message: "Review added successfully" });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; 

  const book = books[isbn]; 

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!Array.isArray(book.reviews)) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  const initialReviewCount = book.reviews.length;
  book.reviews = book.reviews.filter(review => review.username !== username);

  if (book.reviews.length < initialReviewCount) {
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for the user" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
