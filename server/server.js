const express = require('express');
const mongoose = require('mongoose');


const bodyParser = require('body-parser');
const colors = require('colors');

const app = express();


// Configuraciones
const {port, urlDB} = require('./config/config');






// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Configuraciones de las rutas
app.use(require('./routes/index'));





mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if(err) throw err;

    console.log('Base de datos Online'.yellow);
});


app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`.gray);
});
