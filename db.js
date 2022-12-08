const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ebsuporte:<password>@cluster0.ddn1jpw.mongodb.net/?retryWrites=true&w=majority'


mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
        console.log("Conexão estabelecida com o banco!");
})
.catch(err => {
        console.log("Erro ao conectar com o banco...");
        console.log(err);
})