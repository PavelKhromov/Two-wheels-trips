var express = require("express");
var router = express.Router({mergeParams: true});
var Trip = require("../models/trip");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Trip.findById(req.params.id, function(err, trip){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {trip: trip});
        }
    })
});

router.post("/",isLoggedIn,function(req, res){
   //lookup campground using ID
   Trip.findById(req.params.id, function(err, trip){
       if(err){
           console.log(err);
           res.redirect("/trips");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               trip.comments.push(comment);
               trip.save();
               res.redirect('/trips/' + trip._id);
           }
        });
       }
   });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
