var express = require('express');
var router = express.Router();
var passport = require('passport');
var BodyParser = require('body-parser');
var Link = require('../models/links');
var Account = require('../models/account');
var moment = require('moment');



/* GET home page. */
router.get('/', function(req, res) {
    Link.find(function(err, links){
        if(err) {
            console.log('err');
        }

        res.render('index', { user: req.user, links: links });
    });
});

/* GET register page. */
router.get('/register', function(req, res){
    res.render('register', { user: req.user });
});

/* POST register page. */
router.post('/register', function(req, res){
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account){
        if(err) {
            return res.render('register', { account: account });
        }

        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

/* GET login page. */
router.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

/* POST login page. */
router.post('/login', passport.authenticate('local'),function(req, res){
    res.redirect('/');
});

/* GET logout page. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET post page. */
router.get('/post', function(req, res) {
    res.render('post', { user: req.user });
});

/* POST post page. */
router.post('/post', function(req, res) {
    var title = req.body.title;
    var url = req.body.url;
    var date = moment().format("MM-DD-YYYY");
    Link.create({
        title: title,
        url: url,
        author: req.user.username,
        date: date,
        hidden: false
    }, function(err, link) {
        if(err) {
            return console.log(err);
        }

        res.redirect('/');
    });
});

/* GET link page. */
router.get('/:id', function(req, res) {
    Link.findOne({ _id: req.params.id }, function(err, link){
        if(err) {
            return res.send(err);
        }
        res.render('link', { link: link, user: req.user });
    });
});

/* GET comment page. */
router.get('/:id/comment', function(req, res) {
    var id = req.params.id;
    res.render('comment', { user: req.user });
});

/* POST comment page. */
router.post('/:id/comment', function(req, res) {
    var id = req.params.id;
    var body = req.body.body;
    var date = moment().format("MM-DD-YYYY");
    Link.findOne({_id: id}, function(err, link){
        if(err) {
           return console.log(err);
        }
        link.comments.push({ body: body, date: date, author: req.user.username, hidden: false });
        link.save(function(err){
            if(err) {
                return console.log(err);
            }
            res.redirect('/'+ id);
        });
    });
});


module.exports = router;
