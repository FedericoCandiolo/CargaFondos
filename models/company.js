var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var company_schema = new Schema({
  name: String,
  groupid: {
    type: String,
    require: true,
    unique: true
  },
  companyid: {
    type: String,
    require: true,
    unique: true
  },
  companyname: {
    type: String,
    require: true,
    unique: true
  }
});

 //mongoose.model es el contructor de modelo, 1 parametro es nombre del modelo y el 2 es el shcema
var Company = mongoose.model('Company', company_schema);

//toda la comunicacion con mongodb es por modelos.

module.exports.Company = Company;
