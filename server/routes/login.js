const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if(!bycript.compareSync( body.password, usuarioDB.password )){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }


        let token = jwt.sign({
            usuario: usuarioDB
        },
        process.env.SEED,
        {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

    });

});





module.exports = app;
