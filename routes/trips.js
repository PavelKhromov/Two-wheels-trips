var express = require("express");
var router = express.Router();
var Trip = require("../models/trip");

//INDEX - show all trips
router.get("/trips", function(req, res){
    // Get all trips from DB
    Trip.find({}, function(err, allTrips){
       if(err){
           console.log(err);
       } else {
          res.render("trips/index",{trips:allTrips});
       }
    });
});

//CREATE - add new trip to DB
router.post("/trips", isLoggedIn, function(req, res){
    // get data from form and add to trips array
    var name = req.body.name;
    var distance = req.body.distance;
    var image = req.body.image;
    var description = req.body.description;
    var comments = req.body.comments;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTrip = {name: name, distance: distance, image: image, description: description, author: author};



    // Create a new campground and save to DB
    Trip.create(newTrip, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/trips");
        }
    });
});

//NEW - show form to create new campground
router.get("/trips/new", isLoggedIn, function(req, res){
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
            //render show template with that trip
            res.render("trips/show", {trip: foundTrip});
        }
    });
});

//EDIT TRIP

router.get("/trips/:id/edit", checkTripOwnership, function(req, res){
    Trip.findById(req.params.id, function(err, foundTrip){
        res.render("trips/edit", {trip: foundTrip});
    });
});


// UPDATE TRIP

router.put("/trips/:id", checkTripOwnership, function(req, res){
    // google maps
    // geocoder.geocode(req.body.location, function (err, data) {
    // if (err || !data.length) {
    //   req.flash('error', 'Invalid address');
    //   return res.redirect('back');
    // }
    // req.body.trip.lat = data[0].latitude;
    // req.body.trip.lng = data[0].longitude;
    // req.body.trip.location = data[0].formattedAddress;
    // google maps end
    Trip.findByIdAndUpdate(req.params.id, req.body.trip, function(err, updatedTrip){
        if(err){
            res.redirect("/trips");
        } else {
            res.redirect("/trips/" + req.params.id);
        }
    });
});
 // all code
    // UPDATE CAMPGROUND ROUTE
// router.put("/trips/:id", checkTripOwnership, function(req, res){
//   geocoder.geocode(req.body.location, function (err, data) {
//     if (err || !data.length) {
//       req.flash('error', 'Invalid address');
//       return res.redirect('back');
//     }
//     req.body.trip.lat = data[0].latitude;
//     req.body.trip.lng = data[0].longitude;
//     req.body.trip.location = data[0].formattedAddress;

//     Trip.findByIdAndUpdate(req.params.id, req.body.trip, function(err, trip){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             req.flash("success","Successfully Updated!");
//             res.redirect("/trips/" + trip._id);
//         }
//     });
//   });
// });
 //all code ends

// DELETE TRIP ROUTE
router.delete("/trips/:id", checkTripOwnership, function(req, res){
    Trip.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/trips");
      } else {
        req.flash("success", "TRIP DELETED");
        res.redirect("/trips");
      }
    });
});




//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


function checkTripOwnership(req, res, next) {
    if(req.isAuthenticated()){
            Trip.findById(req.params.id, function(err, foundTrip){
                if(err){
                    req.flash("error", "Trip is not found");
                    res.redirect("back");
                } else {
                    // does user own this trip?
                    if(foundTrip.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
             });   
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }

}

module.exports = router;