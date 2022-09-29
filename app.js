var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var Movement = require('./models/movement').Movement;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var fondos = require("./public/metadata.json");
var getPostgres = require("./models/movement_pg").getPostgres;

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
	if(req.session.user_id) res.redirect("/rmovement");
	else{
		console.log(req.session.user_id);
		res.render("index");
	}
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){
		// console.log(doc);
		res.render("signup");
	});
});

app.get("/cmovement",function(req,res){
	Movement.find(function(err,doc){
		// console.log(doc);
		// console.log("LOCALS")
		// console.log(res.locals);
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

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(datestr) {
  if(!datestr) return "";
  let date = new Date(datestr);
  return `${padTo2Digits(date.getDate())}/${padTo2Digits(date.getMonth()+1)}/${date.getFullYear()}`;
}

function formatDateYYYYMMDD(datestr) {
  if (!datestr) return '';
  let date = new Date(datestr);
  return `${date.getFullYear()}${padTo2Digits(date.getMonth() + 1)}${padTo2Digits(
    date.getDate())}`;
}

function formatDateYYYY_MM_DD(datestr) {
  if (!datestr) return '';
  let date = new Date(datestr);
  return `${date.getFullYear()}-${padTo2Digits(
    date.getMonth() + 1
  )}-${padTo2Digits(date.getDate())}`;
}

const formatMoney = num => Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
}).format(Math.abs(num));

app.get('/rmovement', function (req, res) {
    Movement.find(function(err,doc){
		// console.log("DOC");
		// console.log(doc);
		let mismovimientos = doc
      .filter((m) => m.username === req.session.user.username)
      .map((mov) => ({
        ...mov._doc,
        fecha_ts: formatDateYYYYMMDD(mov.fechaoperacion),
        fechaoperacion: formatDate(mov.fechaoperacion),
        importe: formatMoney(mov.importe),
      }))
      .sort(
        (m1, m2) =>
          m1.fecha_ts <= m2.fecha_ts
	  )
	  .reverse();
		
		console.log(mismovimientos);

		res.render('readmovements', {
			user:  req.session.user.username,
			movimientos: mismovimientos,
		});	
	});
//   const movimientos = await getPostgres.read({username: req.session.user.username});
//   console.log("MOVS");
//   console.log(movimientos);
//   res.render('readmovements', {
// 		user: req.session.user.username,
// 		movimientos	
// 	}
//   );
});


app.get('/dmovement/:id',function(req,res){
	console.log("IDMOV");
	console.log(req.params);
	console.log(req.params.id);
	getPostgres.delete({idoperacion: req.params.id});
	Movement.deleteOne({idoperacion: req.params.id})
	.then(()=>console.log("Eliminado"))
	.catch(()=>console.log("NO ELIMINADO!!!"));
	res.redirect('/');
});

app.get('/umovement/:id', function (req, res) {
  console.log('IDMOV');
  Movement.find(function (err, doc) {
    // console.log("DOC");
    // console.log(doc);
	let movimiento = doc.filter((m) => m.idoperacion === req.params.id)[0];
	console.log('==========MOVIMIENTO==============');
    console.log(movimiento);
    res.render('updatemovement', {
	  user: req.session.user.username,	  
	  fechaformat: formatDateYYYY_MM_DD(movimiento.fechaoperacion),
	  importe: Math.abs(movimiento.importe),
      movimiento,
      error: '',
      administradores: unique(fondos.map((fd) => fd.depositaria_nombre)),
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
	var movement_obj = {
		idoperacion: Date.now(),
		time: new Date(),
		username: req.session.user.username,
		groupname: req.session.user.groupname,
		companyname: req.session.user.companyname,
		adminname: fondos
		.map((fd) => fd.depositaria_nombre)
		.filter((fd) => req.body.fondoname.match(fd))[0],
		fondoname: fondos
		.map((fd) => fd.clase_fondo_nombre)
		.filter((fd) => req.body.fondoname.match(fd))[0],
		tipooperacion: req.body.tipooper,
		importe:
		req.body.tipooper === 'Rescate' ? -req.body.importe : req.body.importe,
		fechaoperacion: req.body.fechaoper,
	};
	var movement = new Movement(movement_obj);
	getPostgres.insert(movement_obj);
	movement.save().then(
    function (us) {
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

app.post("/umovement/:id",function(req,res){
	console.log('IDMOV');
  Movement.find(function (err, doc) {
	let movimiento = doc.filter((m) => m.idoperacion === req.params.id)[0];
	movimiento.fechaoperacion = req.body.fechaoper;
	movimiento.adminname = fondos
		.map((fd) => fd.depositaria_nombre)
		.filter((fd) => req.body.fondoname.match(fd))[0];
	movimiento.fondoname = fondos
		.map((fd) => fd.clase_fondo_nombre)
		.filter((fd) => req.body.fondoname.match(fd))[0];
	movimiento.tipooperacion = req.body.tipooper;
	movimiento.importe = req.body.tipooper === 'Rescate' ? -req.body.importe : req.body.importe;

	console.log("MOVIMIENTO A CARGAR");
	console.log(movimiento);

	getPostgres.update(movimiento);
	Movement.findOneAndUpdate({idoperacion: req.params.id}, movimiento).then(
    function (us) {
      //alert('Se guardo exitosamente el movimiento');
      res.redirect('/');
    },
    function (err) {
      if (err) {
        console.log(String(err));
        res.render('updatemovement', {
          error: String(err),
          user: req.session.user.username,
          fechaformat: formatDateYYYY_MM_DD(movimiento.fechaoperacion),
          importe: Math.abs(movimiento.importe),
          movimiento,
          error: '',
          administradores: unique(fondos.map((fd) => fd.depositaria_nombre)),
          fondos: fondos.map(
            (fd) => fd.depositaria_nombre + ' - ' + fd.clase_fondo_nombre
          ),
        });
      }
    }
  );
});
	
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
