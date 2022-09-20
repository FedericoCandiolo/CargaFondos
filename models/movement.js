var mongoose = require("mongoose");
var fondos = require("./../public/metadata.json");
var Schema = mongoose.Schema;

var posibles_valores_admin = fondos.map((fd) => fd.depositaria_nombre);
var posibles_valores_fondo = fondos.map((fd) => fd.clase_fondo_nombre);

var movement_schema = new Schema({
  idoperacion: {
    type: String,
    required: true
  },
  time: { type: Date, default: Date.now },
  username: {
    type: String,
    required: true,
  },
  groupname: {
    type: String,
    required: true
  },
  companyname: {
    type: String,
    required: true
  },
  adminname: {
    type: String,
    required: true,
    enum:{values: posibles_valores_admin, message:"Administrador no válido"}
  },
  fondoname: {
    type: String,
    required: true,
    enum:{values: posibles_valores_fondo, message:"Fondo no válido"}
  },
  tipooperacion: {
    type: String,
    required: true
  },
  importe: {
    type: Number,
    required: true
  },
  fechaoperacion: {
    type: Date
  }
});


 //mongoose.model es el contructor de modelo, 1 parametro es nombre del modelo y el 2 es el shcema
var Movement = mongoose.model('Movement', movement_schema);

//toda la comunicacion con mongodb es por modelos.

module.exports.Movement = Movement;
