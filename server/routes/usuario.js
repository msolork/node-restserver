const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');
const _ = require('underscore');



app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 7;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo cargar usuarios',
                    errors: err
                });
            }

            Usuario.count({estado: true}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });


        });


});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bycript.hashSync(body.password, 10),
        role: body.role
    });




    usuario.save(  (err, usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Fallo al crear el usuario',
                errors: err
            });
        }


        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate({_id: id},
        {body},
        {new: true, runValidators: true},
        (err, usuarioDB) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo al actualizar usuario',
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });



        });


});

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id,
        cambiaEstado,
        {new: true, runValidators: true},
        (err, usuarioEliminado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo al eliminar usuario',
                    err
                });
            }

            if(!usuarioEliminado){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Fallo al eliminar usuario',
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            return res.status(200).json({
               ok: true,
               usuario: usuarioEliminado
            });
    });
});


module.exports = app;
