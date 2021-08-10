require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");

var bodyParser = require("body-parser")

//Database
const database = require("./database");


//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,
{
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useFindAndModify: false,
 useCreateIndex: true
}
).then(() => console.log("Connection Established"));

//API to get all the books
/*
Route         /
Description   Get all the BOOKS
Access        Public
Parameter     None
Methods       GET
*/
booky.get("/",(req,res) =>{
  return res.json({books: database.books});
});

//API to get all the Specific book
/*
Route         /is
Description   Get all the specific book
Access        Public
Parameter     isbn
Methods       GET
*/

booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );
  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for ISBN of ${req.params.isbn}`});
  }
  return res.json({book: getSpecificBook});
});


//API to get all the books by category
/*
Route         /c
Description   Get all the  specific books by category
Access        Public
Parameter     category
Methods       GET
*/

booky.get("/c/:category",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )

if(getSpecificBook.length === 0) {
  return res.json({error: `No book found for the category of ${req.params.category}`})
}

return res.json({book: getSpecificBook});
});


//API to get specific books by language
/*
Route         /ln
Description   Get all the  specific books by language
Access        Public
Parameter     language
Methods       GET
*/

booky.get("/ln/:language",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )

if(getSpecificBook.length === 0) {
  return res.json({error: `No book found for the category of ${req.params.language}`})
}

return res.json({book: getSpecificBook});
});


//API to get author
/*
Route         /author
Description   Get the author
Access        Public
Parameter     None
Methods       GET
*/

booky.get("/author",(req,res) => {
  return res.json({author: database.author});
});


//API to get author
/*
Route         /author/book
Description   Get the author
Access        Public
Parameter     isbn
Methods       GET
*/

booky.get("/author/book/:isbn",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );
  if(getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`});
  }
  return res.json({authors: getSpecificAuthor});
});

//API to get author
/*
Route         /author/book
Description   Get the author
Access        Public
Parameter     isbn
Methods       GET
*/


booky.get("/author/book/:id",(rer,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.id)
  );
  if(getSpecificAuthor.length === 0) {
    return res.json({error: `No author found for the book of ${req.params.id}`});
  }
  return res.json({authors: getSpecificAuthor});
});

//API to get publication
/*
Route         /publication
Description   Get the publication
Access        Public
Parameter     None
Methods       GET
*/

booky.get("/publications",(req,res) => {
  return res.json({publications: database.publication});
});

//API to get specific publication
/*
Route         /publication
Description   Get the specific publication
Access        Public
Parameter     name
Methods       GET
*/


booky.get("/publications/:name",(req,res) =>{
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.name.includes(req.params.name)
  );
  if(getSpecificPublication.length === 0) {
    return res.json({error: `No publication found for the book of ${req.params.name}`});
  }
  return res.json({publications: getSpecificPublication});
});


//API to get publication by books
/*
Route         /publication
Description   Get the publication by name of books
Access        Public
Parameter     books
Methods       GET
*/

booky.get("/publications/:books",(req,res) =>{
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.books)
  );
  if(getSpecificPublication.length === 0) {
    return res.json({error: `No publication found for the book of ${req.params.books}`});
  }
  return res.json({publications: getSpecificPublication});
});


//API to get new books
/*
Route         /book/new
Description   Add new books
Access        Public
Parameter     None
Methods       POST
*/

booky.post("/book/new",(req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});


//API to get new author
/*
Route         /author/new
Description   Add new author
Access        Public
Parameter     None
Methods       POST
*/

booky.post("/author/new",(req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthor: database.author});
});


//API to get new book publication
/*
Route         /publication/new
Description   Add new publication
Access        Public
Parameter     None
Methods       POST
*/


booky.post("/publications/new",(req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublication: database.publication});
});


//API to get new book publication
/*
Route         /publication/update/book
Description   Update or add new publication
Access        Public
Parameter     isbn
Methods       PUT
*/



booky.put("/publication/update/book/:isbn",(req,res) => {
  //Update the publication Database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn)
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});



/********DELETE**********/
//API to Delete a book
/*
Route         /book/delete
Description   Delete a book
Access        Public
Parameter     isbn
Methods       DELETE
*/

booky.delete("/book/delete/:isbn",(req,res) => {
  //Whichever book which does not match with the isbn no.

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;
  return res.json({books: database.books});
});


/*
Route         /book/delete/author
Description   Delete an author from a book and vice versa
Access        Public
Parameter     isbn,  authorId
Methods       DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});






booky.listen(3000,() => {
  console.log("Server is up and running");
});
