var express = require("express");
var router = express.Router();
var Trip = require("../models/trip");

//INDEX - show all campgrounds
router.get("/trips", function(req, res){
    // Get all campgrounds from DB
    Trip.find({}, function(err, allTrips){
       if(err){
           console.log(err);
       } else {
          res.render("trips/index",{trips:allTrips});
       }
    });
});

//CREATE - add new campground to DB
router.post("/trips", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newTrip = {name: name, image: image, description: description}
    // Create a new campground and save to DB
    Trip.create(newTrip, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/trips");
        }
    });
});

//NEW - show form to create new campground
router.get("/trips/new", function(req, res){
   res.render("trips/new"); 
});

// SHOW - shows more info about one campground
router.get("/trips/:id", function(req, res){
    //find the campground with provided ID
    Trip.findById(req.params.id).populate("comments").exec(function(err, foundTrip){
        if(err){
            console.log(err);
        } else {
            console.log(foundTrip)
            //render show template with that campground
            res.render("trips/show", {trip: foundTrip});
        }
    });
});

module.exports = router;