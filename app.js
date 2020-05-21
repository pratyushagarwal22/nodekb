const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

// Init App
const app = express();

// To configure express to use body-parser as middleware - these lines essential and needed to use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// To let Express know that we need to treat ./public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat', // Can be any value
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middeware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


//Connect to the database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection; //then create the models

// To send a message if we're actually connected
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// To check that there are no DB Errora
db.on('error', function(err){
    console.log(err);
});

// Using mongodb articles - bringing in models
let Article = require('./models/article');





//To implement control structures in Pug - creating a static array of objects - ultimately they will come from MongoDB
    // let articles = [
    //     {
    //         id:1,
    //         title:'Article One',
    //         author:'John Doe',
    //         body:'This is the content for Article One'
    //     },
    //     {
    //         id:2,
    //         title:'Article Two',
    //         author:'Jane Doe',
    //         body:'This is the content for Article Two'
    //     },
    //     {
    //         id:3,
    //         title:'Article Three',
    //         author:'Pratyush Agarwal',
    //         body:'This is the content for Article Three'
    //     }

    // ];

// Can use ES6 syntax as well which is basically just arrow functions







//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home Route
app.get('/', function(req,res){
    //For Express
    //res.send('Hello World');

    //For Pug Template
    // res.render('index');

    // rendering values using Mongodb Database
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index', {
                title:'Articles',
                articles:articles
            }); 
        }
    });


    //To pass values to the template/views - rendering a static array
    // res.render('index', {
    //     title:'Articles',
    //     articles:articles
    // });
});

// Bringing in the Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);






// All of this shifted to /routes/article.js as we are creating a route to clean up the code




// // To create a route to direct to each ID - Get Single Article
// // : => it is a place holder, it can be anything
// app.get('/article/:id', function(req, res){
//     Article.findById(req.params.id, function(err, article){
//         res.render('article', {
//             article:article
//         });
//     });
// });

// //New Route to Add an Article
// app.get('/articles/add', function(req, res){
//     res.render('add_article', {
//         title:'Add Article'
//     });
// });

// // To Add a submit POST route
// app.post('/articles/add', function(req,res){
//     // Implementing Validator now
//     req.checkBody('title', 'Title is required').notEmpty();
//     req.checkBody('author', 'Author is required').notEmpty();
//     req.checkBody('body', 'Body is required').notEmpty();

//     // Get the Errors
//     let errors = req.validationErrors();
//     if(errors){
//         res.render('add_article', {
//             title: 'Add Article', // Needs to be added as we added it when rendering the route for the first time
//             errors:errors
//         });
//     }
//     else {
//         let article = new Article();
//         article.title = req.body.title;
//         article.author = req.body.author;
//         article.body = req.body.body;

//         article.save(function(err){
//             if(err) {
//                 console.log(err)
//                 return;
//             }
//             else {
//                 req.flash('success', 'Article Added'); // Added while implementing Messaging and Validation
//                 res.redirect('/');
//             }
//         });
//     }

//     // Since we're implementing validation this will all go in the else above
//     // let article = new Article();
//     // article.title = req.body.title;
//     // article.author = req.body.author;
//     // article.body = req.body.body;

//     // article.save(function(err){
//     //     if(err) {
//     //         console.log(err)
//     //         return;
//     //     }
//     //     else {
//     //         req.flash('success', 'Article Added'); // Added while implementing Messaging and Validation
//     //         res.redirect('/');
//     //     }
//     // });
// });


// // To Add a submit POST route for the Edit option
// app.post('/articles/edit/:id', function(req,res){
//     let article = {}
//     article.title = req.body.title;
//     article.author = req.body.author;
//     article.body = req.body.body;

//     let query = {_id:req.params.id}

//     Article.update(query, article, function(err){
//         if(err) {
//             console.log(err)
//             return;
//         }
//         else {
//             req.flash('success', "Article Updated");
//             res.redirect('/');
//         }
//     });
// });

// // Creating a delete request
// app.delete('/article/:id', function(req, res){
//     let query = {_id:req.params.id};
    
//     Article.remove(query, function(err){
//         if(err){
//             console.log(err);
//         }
//         // By default it will send a 200 status which means that it is okay
//         res.send('Success');
//     });
// });

// // To create a route to edit a single value - same as getting a single article, and then we need to load the edit form
// app.get('/article/edit/:id', function(req, res){
//     Article.findById(req.params.id, function(err, article){
//         res.render('edit_article', {
//             title:'Edit Article',
//             article:article
//         });
//     });
// });








//Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000....');
});









































