const express = require('express');
const app = express();

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

// =========================
// Obtener categorias
// =========================
app.get('/categoria', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 7;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo cargar categorias',
                    errors: err
                });
            }

            Categoria.count({estado: true}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    categorias,
                    conteo
                });
            });
        });

});


// =========================
// Obtener categoria
// =========================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById({_id: id}, (err, categoriaDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Fallo cargar categoria',
                errors: err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        return res.status(200).json({
           ok: true,
           categoria: categoriaDB

        });
    });

});


// =========================
// Crear categorias
// =========================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                errors: err
            });
        }

        if(!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    mensaje: 'Fallo al crear categoria'
                }
            });
        }


        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });



});


// =========================
// Actualizar categorias
// =========================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id,
        { descripcion: body.descripcion},
        {new: true, runValidators: true},
        (err, categoriaDB) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    errors: err
                });
            }

            if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    errors: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                categoria: categoriaDB
            });
        });

});


// =========================
// Eliminar categorias
// =========================
app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                errors: err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });


});


module.exports = app;
