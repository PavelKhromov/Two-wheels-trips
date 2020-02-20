var express = require("express");
var router = express.Router();
var Trip = require("../models/trip");
//new upload --------------
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'do0rfhoo3', 
  api_key: '279161765945811',
  api_secret: 'cn2yGh1Erpn5TC1cgDSkrSKRFF0'
});

//-------------------------

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
router.post("/trips", isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
      // add cloudinary url for the image to the campground object under image property
      req.body.trip.image = result.secure_url;
      //add image's public_id to trip
      req.body.trip.imageId = result.public_id;
      // add author to campground
      req.body.trip.author = {
        id: req.user._id,
        username: req.user.username
      }
      Trip.create(req.body.trip, function(err, trip) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/trips/' + trip.id);
      });
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
    Trip.findByIdAndUpdate(req.params.id, req.body.trip, function(err, updatedTrip){
        if(err){
            res.redirect("/trips");
        } else {
            res.redirect("/trips/" + req.params.id);
        }
    });
});

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