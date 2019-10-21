// =====================================
// Puerto
// =====================================

const port = process.env.PORT || 3000;


// =======================================
// ENTORNO
// =======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================
// Base de datos
// =====================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://miguelzero:0N9h2rF9HGW5FTzg@cluster0-jdrqa.mongodb.net/cafe?retryWrites=true&w=majority';
}


module.exports = {
    port,
    urlDB

};
