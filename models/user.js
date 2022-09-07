var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// const uri =
//  'mongodb://fcandiolo:pythontabler0@cluster0.uonfoik.mongodb.net/?retryWrites=true&w=majority';

const uri =
  'mongodb+srv://fcandiolo:pythontablero@cluster0.uonfoik.mongodb.net/?retryWrites=true&w=majority';

mongoose.Promise = require('bluebird');
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected',  ()=>{
  console.log('Mongoose is connected!');
})


var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email valido"]


var user_schema = new Schema({
  name: String,
  username: {
    type: String,
    require: true,
    unique: true,
    maxlength: [50, 'El tamaño maximo es de 50 caracteres'],
  },
  groupname: {
    type: String,
    require: true,
    maxlength: [50, 'El tamaño maximo es de 50 caracteres'],
  },
  companyname: {
    type: String,
    require: true,
    maxlength: [50, 'El tamaño maximo es de 50 caracteres'],
  },
  password: {
    type: String,
    minlength: [8, 'el tamaño minimo es de 8 caracteres'],
    validate: {
      validator: function (p) {
        return this.password_confirmation == p;
      },
      message: 'Las contraseñas no son iguales',
    },
  },
  email: {
    type: String,
    require: 'El correo es obligatorio',
    match: email_match,
  },
});

user_schema.virtual("password_confirmation").get(function(){
  return this.p_c;
}).set(function(password){
  this.p_c = password;
});

 //mongoose.model es el contructor de modelo, 1 parametro es nombre del modelo y el 2 es el shcema
var User = mongoose.model("User",user_schema);

//toda la comunicacion con mongodb es por modelos.

module.exports.User = User;
