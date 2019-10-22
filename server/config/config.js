// =====================================
// Puerto
// =====================================
const port = process.env.PORT || 3000;


// =======================================
// ENTORNO
// =======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===================================================
// Vencimiento del token
// ===================================================
process.env.CADUCIDAD_TOKEN = '72h';


// ===================================================
// SEED de autenticacion
// ===================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';



// =====================
// Base de datos
// =====================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}



// ===========================
// Google Client_id
// ===========================


process.env.CLIENT_ID = '473576974178-fp5c5297r9a4nekukdkk4skds9h5k5o2.apps.googleusercontent.com';

module.exports = {
    port,
    urlDB

};
