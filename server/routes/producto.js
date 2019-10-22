const express = require('express');
const app = express();

const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');


// =========================
// Obtener productos
// =========================

app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 7;
    limite = Number(limite);

    Producto.find({disponible: true})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo cargar productos',
                    errors: err
                });
            }

            Producto.count({estado: true}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    productos,
                    conteo
                });
            });
        });
});


// =========================
// Obtener producto
// =========================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById({_id: id})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo cargar producto',
                    errors: err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    errors: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                producto: productoDB

            });
        });

});



// =========================
// Buscar productos
// =========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo cargar producto',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                productos

            });
        });

});


// =========================
// Crear productos
// =========================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Fallo crear producto',
                errors: err
            });
        }

        return res.status(201).json({
           ok: true,
           producto: productoDB
        });
    });


});


// =========================
// Actualizar productos
// =========================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let productoAct = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id,
        {productoAct},
        {new: true, runValidators: true},
        (err, productoDB) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    errors: err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    errors: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                producto: productoDB
            });
        });

});


// =========================
// Eliminar productos
// =========================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate({_id: id},
        cambiaEstado,
        {new: true, runValidators: true},
        (err, productoDB) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    errors: err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    errors: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: 'Producto eliminado',
                producto: productoDB
            });
    });

});


module.exports = app;
