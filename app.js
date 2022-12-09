var request = require("request");
var express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Livro = require('./models/livro');
const methodOverride = require('method-override');
const connectDatabase = require('./database/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

var resposta = {};

app.get('/', (req, res) => {
    res.render('busca');
});

app.get('/buscaISBN', (req, res) => {
    const {isbn} = req.query;
    request("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body);
        }
        res.render('resultadoBusca', {resposta});
    });
});

app.get('/buscaTitulo', (req, res) => {
    const {titulo} = req.query;
    request("https://www.googleapis.com/books/v1/volumes?q=intitle:" + titulo, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body);
        }
        res.render('resultadoBusca', {resposta});
    });
});

app.get('/livros', async(req, res) => {
    const livros = await Livro.find({});
    res.render('livros/index', {livros});
});

app.get('/livros/:id', async(req, res) => {
    const { id } = req.params;
    const livro = await Livro.findById(id);
    if (livro) {
        res.render('livros/show', { livro });
    } else {
        res.send('O livro não foi encontrado.');
    }
});

app.post('/livros/:id', async(req, res) => {
    const { id } = req.params;
    if(resposta.totalItems > 0) {
        for(item of resposta.items) {
            if (item.id == id){
                const livro = item.volumeInfo;
                const livroEncontrado = await Livro.find({title: livro.title});
                const thumbnail = livro.imageLinks ? livro.imageLinks.thumbnail : "";
                if (livroEncontrado.length == 0){
                    const novoLivro = new Livro({title: livro.title, authors: livro.authors, industryIdentifiers: livro.industryIdentifiers, thumbnail: thumbnail, comment: ""});
                    await novoLivro.save();
                    console.log("Livro salvo!");
                } else {
                    console.log("Livro já está na lista de favoritos.");
                }
            }
        }
    }
});

app.get('/livros/:id/edit', async(req, res) => {
    const { id } = req.params;
    const livro = await Livro.findById(id);
    if (livro) {
        res.render('livros/edit', { livro });
    } else {
        res.send('O livro não foi encontrado.');
    }
});

app.patch('/livros/:id', async(req, res) => {
    const { id } = req.params;
    const {comment} = req.body;
    await Livro.findByIdAndUpdate(id, {comment});
    res.redirect('/livros/' + id);
});

app.delete('/livros/:id', async(req, res) => {
    const { id } = req.params;
    await Livro.findByIdAndDelete(id);
    res.redirect('/livros');
});
connectDatabase();
let porta = 3030;
app.listen(porta, () => console.log("Servidor ligado na porta "+porta));