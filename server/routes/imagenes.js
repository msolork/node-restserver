const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const { verificaTokenImagen  } = require('../middlewares/autenticacion');

// Default options
app.use( fileUpload({ useTempFiles: true }) );



app.get('/imagen/:tipo/:img', verificaTokenImagen, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ img }`);

    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    if (fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        res.sendFile(noImagePath);

    }



});



module.exports = app;
