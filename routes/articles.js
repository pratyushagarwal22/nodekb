const express = require('express');
const router = express.Router();

// Bringing in Article Model
let Article = require('../models/article');


// Changed all the app. statements to router. as this document will not know what app is
// Getting rid of all the /articles  as we have included that route in the app.js file

//New Route to Add an Article
router.get('/add', function(req, res){
    res.render('add_article', {
        title:'Add Article'
    });
});

// To Add a submit POST route
router.post('/add', function(req,res){
    // Implementing Validator now
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get the Errors
    let errors = req.validationErrors();
    if(errors){
        res.render('add_article', {
            title: 'Add Article', // Needs to be added as we added it when rendering the route for the first time
            errors:errors
        });
    }
    else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save(function(err){
            if(err) {
                console.log(err)
                return;
            }
            else {
                req.flash('success', 'Article Added'); // Added while implementing Messaging and Validation
                res.redirect('/');
            }
        });
    }

    // Since we're implementing validation this will all go in the else above
    // let article = new Article();
    // article.title = req.body.title;
    // article.author = req.body.author;
    // article.body = req.body.body;

    // article.save(function(err){
    //     if(err) {
    //         console.log(err)
    //         return;
    //     }
    //     else {
    //         req.flash('success', 'Article Added'); // Added while implementing Messaging and Validation
    //         res.redirect('/');
    //     }
    // });
});


// To Add a submit POST route for the Edit option
router.post('/edit/:id', function(req,res){
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, function(err){
        if(err) {
            console.log(err)
            return;
        }
        else {
            req.flash('success', "Article Updated");
            res.redirect('/');
        }
    });
});

// To create a route to edit a single value - same as getting a single article, and then we need to load the edit form
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        });
    });
});

// Creating a delete request
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id};
    
    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        // By default it will send a 200 status which means that it is okay
        res.send('Success');
    });
});

// Originally was at the top moved to the bottom to allow all the routes to load first
// To create a route to direct to each ID - Get Single Article
// : => it is a place holder, it can be anything
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article:article
        });
    });
});


// To make sure that router is accessible from the outside
module.exports = router;


