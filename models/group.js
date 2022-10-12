var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var group_schema = new Schema({
  name: String,
  idgrupo: {
    type: String,
    require: true,
    unique: true
  },
  nombregrupo: {
    type: String,
    require: true,
    unique: true
  }
});

 //mongoose.model es el contructor de modelo, 1 parametro es nombre del modelo y el 2 es el shcema
var Group = mongoose.model('Group', group_schema);

//toda la comunicacion con mongodb es por modelos.

module.exports.Group = Group;
