var express = require("express");
var router = express.Router({mergeParams: true});
var Trip = require("../models/trip");
var Comment = require("../models/comment");

// ==================== 
// COMMENTS ROUTES
// ====================

router.get("/new", isLoggedIn, function(req, res){
    // find trip by id
    console.log(req.params.id);
    Trip.findById(req.params.id, function(err, trip){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {trip: trip});
        }
    })
});

//Comments create
router.post("/", isLoggedIn, function(req, res){
   //lookup trip using ID
   Trip.findById(req.params.id, function(err, trip){
       if(err){
           console.log(err);
           res.redirect("/trips");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
              //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               trip.comments.push(comment);
               trip.save();
               console.log(comment);
               //req.flash('success', 'Created a comment!');
               res.redirect("/trips/" + trip._id);

               // trip.comments.push(comment);
               // trip.save();
               // res.redirect('/trips/' + trip._id);
           }
        });
       }
   });
});

router.get("/:comment_id/edit", function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit" , {trip_id: req.params.id, comment: foundComment});
    }
  });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
