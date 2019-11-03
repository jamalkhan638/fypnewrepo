const express = require('express');
const app=express();
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

//initialize passport 
// Passport Config
require('./config/passport')(passport);

//Require Routes Here
const Blogs = require('./Api/Routes/blogs');
const Contact = require('./Api/Routes/contact');
const Admin = require('./Api/Routes/admin');
const Dashborad = require('./Api/Routes/dashboard');
const Rooms = require('./Api/Routes/rooms');

//MongoDb Connection
mongoose.connect(
    "mongodb://localhost/Hostels",{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true ,useFindAndModify: false }
).then(() => {
    console.log("Connected to Database");
    })
    .catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });
mongoose.Promise=global.Promise;

//app.use(express_layout);
app.set('views',path.join( __dirname +'/views'));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));



app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(helmet());
app.use(methodOverride('_method'));

//For session
app.use(
    session({
      secret: 'ThisIsMySecretKeyOkay',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
//TO Render Index Page
app.get('/',(req,res)=>{
    res.render('index');
});
//To render About page
app.get('/aboutus',(req,res)=>{
    res.render('about')
})
//to render Signup page
app.get('/api/signup',(req,res)=>{
    res.render('signup');
})
//To render Login Page
app.get('/api/login',(req,res)=>{
    res.render('login');
})
//to render rooms page
app.get('/rooms',(req,res)=>res.render('booking'));
//For Blog
app.use('/hostel',Blogs);
//For Contact
app.use('/contact',Contact);
//For Admin
app.use('/api/admin',Admin);
//To Test 
app.use('/api/dashboard',Dashborad);
//For Room
app.use('/admin',Rooms);

module.exports=app