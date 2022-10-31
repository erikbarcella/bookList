const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    title: String,
    authors: [String],
    industryIdentifiers: [{}],
    thumbnail: String,
    comment: String
});

const Livro = mongoose.model("Livro", livroSchema);

module.exports = Livro;