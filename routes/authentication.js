var express = require('express'),
    bcrypt = require('bcrypt'),
    db = require('../models'),
    router = express.Router();


//get new user page
router.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/posts');
  }

  res.render('users/new');
});

//post new user data
router.post('/users', (req, res) => {
  db.User.create(req.body).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch(() => {
    res.redirect('/register');
  });
});

router.get('/login', (req, res) => {
  res.redirect('/admin');
});


//login user
router.post('/login', (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.passwordDigest, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    });
  }).catch(() => {
    res.redirect('/login');
  });
});

//log out user
router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

module.exports = router;
