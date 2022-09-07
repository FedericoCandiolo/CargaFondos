var User = require('../models/user').User;

module.exports = (req, res, next) => {
  //Next es el siguiente middleware a ejecutar. Esos 3 forman al middle
  if (!req.session.user_id) res.redirect('/login');
  else {
    User.findById(req.session.user_id, function (err, user) {
      if (err) {
        console.log(err);
        res.redirect('/login');
      } else {
        res.locals = {...res.locals, user };
        console.log(res.locals);
        next();
      }
    });
  }
};
