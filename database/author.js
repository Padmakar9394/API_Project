const mongoose = require("mongoose");

//Create book schema
const AuthorSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;
