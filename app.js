var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var Movement = require('./models/movement').Movement;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var fondos = require("./public/metadata.json")

var app = express();

app.use("/estatico",express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: "5454sddsfdfsfdg54dfsfs",
	resave: false,
	saveUninitialized: false
}));


const unique = arr => [... new Set(arr)];

app.set("view engine","jade");

app.get("/",function(req,res){
	if(req.session.user_id) res.redirect("/movement");
	else{
		console.log(req.session.user_id);
		res.render("index");
	}
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("signup");
	});
});

app.get("/movement",function(req,res){
	Movement.find(function(err,doc){
		console.log(doc);
		console.log("LOCALS")
		console.log(res.locals);
		res.render('movement', {
			user:  req.session.user.username,
			error: '',
			administradores: unique(fondos.map((fd) => fd.depositaria_nombre)),
			//   fondos: fondos.map((fd) => fd.clase_fondo_nombre),
			fondos: fondos.map(
				(fd) => fd.depositaria_nombre + ' - ' + fd.clase_fondo_nombre
			),
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/users",function(req,res){
	var user = new User({
    email: req.body.email,
    username: req.body.username,
    groupname: req.body.grupo,
    companyname: req.body.compania,
    password: req.body.password,
    password_confirmation: req.body.password_confirmation,
  });
	console.log(user.password_confirmation);

	user.save().then(function(us){
		//alert("Se guardo exitosamente el usuario");
		User.findOne(
			{ 
				username: req.body.username, password: req.body.password },
			function (err, user) {
				req.session.user_id = user._id;
				req.session.user = user;
				res.redirect('/');
				//res.send("hola mundo");
			}
		);
		//res.redirect("/");
	},function(err){
		if(err){
				//console.log(String(err));
				res.redirect("/login");
			}
	});
});

app.get("/close",function(req,res){
	console.log("SESION");
	console.log(req.session);
	req.session.user_id = null;
	req.session.user = null;
	res.redirect("/");
})

app.post("/uploadmovement",function(req,res){
	var movement = new Movement({
    idoperacion: Date.now(),
    time: new Date(),
    username: req.session.user.username,
    groupname: req.session.user.groupname,
    // groupname: req.body.grupo,
    companyname: req.session.user.companyname,
    // companyname: req.body.compania,
    adminname: fondos
      .map((fd) => fd.depositaria_nombre)
      .filter((fd) => req.body.fondoname.match(fd))[0],
    fondoname: fondos
      .map((fd) => fd.clase_fondo_nombre)
      .filter((fd) => req.body.fondoname.match(fd))[0],
    tipooperacion: req.body.tipooper,
    importe:
      req.body.tipooper === 'Rescate' ? -req.body.importe : req.body.importe,
  });
	  console.log(movement);
	  console.log("SESION");
	  console.log(req.session);
	movement.save().then(
    function (us) {
	  //alert('Se guardo exitosamente el movimiento');
	  res.redirect("/");
    },
    function (err) {
      if (err) {
		console.log(String(err));
		res.render('movement', {
			error: String(err),
			administradores: unique(fondos.map((fd) => fd.depositaria_nombre)),
			//   fondos: fondos.map((fd) => fd.clase_fondo_nombre),
			fondos: fondos.map(
				(fd) => fd.depositaria_nombre + ' - ' + fd.clase_fondo_nombre
			),
		});
      }
    }
  )
});

app.post("/sessions",function(req,res){
	User.findOne({username: req.body.username,password: req.body.password},function(err,user){
		if(user){
			req.session.user_id = user._id;
			req.session.user = user;
			res.redirect("/");
		}
		else res.redirect("/login");
		//res.send("hola mundo");
	});
});

app.use("/app",session_middleware);
app.use("/app",router_app);

app.listen(8080);
