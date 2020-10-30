// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  console.log("INNNNNNNNNNNN")
  // find all books in the books collection
  book.find({}).exec(function (err, books) {
    if (err) {
        res.send('error has occured');
    } else {
      console.log(books)
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', {
    title: 'Books',
    books: {}
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  var bk = new book();
  bk.Title = req.body.title;
  bk.Author = req.body.author;
  bk.Price = req.body.price;
  bk.Genre = req.body.genre;
  bk.save(function (err, book) {
      if (err) {
          res.send('error saving book');
      } else {
          res.redirect("/books")
      }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  book.findOne({
    _id: req.params.id
  }).exec(function (err, book) {
      if (err) {
          res.send('error has occured');
      } else {
          res.render('books/details', { title: 'Edit Book', books: book })
      }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  book.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
        Title: req.body.title,
        Price: req.body.price,
        Author: req.body.author,
        Genre: req.body.genre,
    }
  }, {
      upsert: true
  }, function (err, newBook) {
      if (err) {
          res.send('error updating Book');
      } else {
          res.redirect("/books")
      }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  book.findByIdAndRemove({
    _id: req.params.id
  }, function (err, book) {
      if (err) {
          res.send('error deleting book');
      } else {
          res.redirect("/books")
      }
  });
});


module.exports = router;
