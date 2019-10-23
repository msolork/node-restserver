const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');


// =======================================
// Verificar Token
// =======================================

let verificaToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded) => {

      if(err){
         return res.status(401).json({
            ok: false,
            err: 'Token no valido'
         });
     }

     req.usuario = decoded.usuario;

    next();

  });

};




// =======================================
// Verificar ADMIN_ROLE
// =======================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok: false,
            err: 'El usuario no es administrador'
        });
    }

};




// =======================================
// Verificar Token para imagen
// =======================================

let verificaTokenImagen = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
};



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImagen
};
