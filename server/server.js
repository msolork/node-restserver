const express = require('express');
const bodyParser = require('body-parser');
const app = express();


// Configuraciones
const {port} = require('./config/config');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



app.get('/', function (req, res) {
    res.json('Hello World');
});

app.get('/usuario', function (req, res) {
    res.json('Usuario');
});

app.post('/usuario', function (req, res) {
    let nombre = req.body.nombre;

    if(nombre === undefined){
        return res.status(400).json({
           ok: false,
           mensaje: 'Falta el nombre'
        });
    }else{
        res.json({
            nombre
        });

    }

});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json('Usuario', id);
});

app.delete('/usuario/:id', function (req, res) {
    res.json('Usuario');
});

app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`);
});
