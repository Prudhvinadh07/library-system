let express = require("express");
let app = express();

app.use(express.json()); // for parsing application/json

app.listen(3000, () => console.log(`server is running`));

class Book {
  constructor(title, author, ISBN) {
    // Initialize attributes
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }
  displayInfo() {
    // Display book information
    return {
      title: this.title,
      author: this.author,
      ISBN: this.ISBN,
      fileFormat: this.fileFormat,
    };
  }
}

class EBook extends Book {
  constructor(title, author, ISBN, fileFormat) {
    super(title, author, ISBN);
    // Initialize fileFormat
    this.fileFormat = fileFormat;
  }
  displayInfo() {
    // Override to display eBook information

    super.displayInfo(this.fileFormat);
  }
}

class Library {
  constructor() {
    this.books = [];
  }
  addBook(book) {
    // Add book to library
    return this.books.push(book);
  }
  displayBooks() {
    // Display all books in library
    return this.books;
  }

  deleteBook(ISBN) {
    // Delete book with ISBN
    let books = this.displayBooks();
    books = books.filter((eachBook) => eachBook.ISBN !== ISBN);
    this.books = books;
  }

  searchByTitle(title) {
    // Search books by title
    let books = this.displayBooks();
    books = books.filter((eachBook) => eachBook.title.includes(title));
    return books;
  }
}

const libraryyy = new Library();

app.post("/addBook", (req, res) => {
  // Logic to add a book
  try {
    const { title, author, ISBN, fileFormat } = req.body;
    if (!title || !author || !ISBN) {
      res.status(400);
      res.send({
        status: 400,
        message: "Sorry! Provide book details",
      });
      return;
    }

    let book = new EBook(title, author, ISBN, fileFormat);
    libraryyy.addBook(book);
    res.send({ status: 200, message: "Book added successfully" });
  } catch (error) {
    res.status(400);
    res.send({ status: 400, message: "Sorry! your request has not processed" });
  }
});

app.get("/listBooks", (req, res) => {
  // Logic to list books
  try {
    const books = libraryyy.displayBooks();
    res.send({ status: 200, message: "Success", data: books });
  } catch (error) {
    console.log("Sorry Error occurred", error);
    res.status(400);
    res.send({ status: 400, message: "Sorry! your request has not processed" });
  }
});

app.delete("/deleteBook", (req, res) => {
  // Logic to delete a book
  try {
    const { ISBN } = req.body;
    libraryyy.deleteBook(ISBN);
    res.send({ status: 200, message: "Book deleted successfully" });
  } catch (error) {
    res.status(400);
    res.send({ status: 400, message: "Sorry! your request has not processed" });
  }
});

app.get("/title", (req, res) => {
  // Logic to search a book by title
  try {
    const { title } = req.body;
    const book = libraryyy.searchByTitle(title);
    if (book.length === 0) {
      return res.send({
        status: 200,
        message: "Book not found with the title",
        data: book,
      });
    }
    res.send({ status: 200, message: "Success", data: book });
  } catch (error) {
    res.status(400);
    res.send({ status: 400, message: "Sorry! your request has not processed" });
  }
});
