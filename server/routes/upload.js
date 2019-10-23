const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// Default options
app.use( fileUpload({ useTempFiles: true }) );



app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err : {
                message: 'No se ha seleccionado un archivo'
            }
        });
    }


    // Validar Tipos
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err : {
                message: `Los tipos validos son ${tiposValidos.join(', ')}`
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    // Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err : {
                message: `Las extensiones validas son ${extensionesValidas.join(', ')}`,
                ext: extension
            }
        });
    }

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aquí, Imagen cargada

        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else if(tipo === 'productos'){
            imagenProducto(id, res, nombreArchivo);
        }


    });

});




function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioImg) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
               ok: true,
               usuario: usuarioImg,
               img: nombreArchivo
            });
        });

    });

}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) => {

        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoImg) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                producto: productoImg,
                img: nombreArchivo
            });
        });

    });
}


function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;
