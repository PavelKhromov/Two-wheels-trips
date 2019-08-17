var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Trip = require("./models/trip");
var Comment = require("./models/comment");
var seedDB =require("./seeds");

mongoose.connect("mongodb://localhost:27017/two_wheels_trips", {useNewUrlParser: true});


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();



// Trip.create(
// {
// 	name: "Seven Lakes",
// 	image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg",
// 	description: "This is a great one day escape with good twisty roads"


// }, function(err, trip){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("newly created trip: ");
// 		console.log(trip);
// 	}
// });



app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - All trips
app.get("/trips", function(req, res){
	// Get all trips from DB
	Trip.find({}, function(err, allTrips){
		if(err){
			console.log(err);
		} else {
			res.render("trips/index", {trips:allTrips});
		}
	});
	
});

//CREATE - add new trip to DB
app.post("/trips", function(req, res){
	
	// get data from form and add to trips array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newTrip = {name: name, image: image, description: description}
	// Create a new trip and save to the DB
	Trip.create(newTrip, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/trips");
		}
	});
});

// NEW - show form to create new trip
app.get("/trips/new", function(req, res){
	res.render("trips/new");
});

// SHOW - shows more info about one trip
app.get("/trips/:id", function(req, res){
	//find the trip with provided ID
	Trip.findById(req.params.id).populate("comments").exec(function(err, foundTrip){
		if(err){
			console.log(err);
		} else {
			console.log(foundTrip);
			// render show template with trips
			res.render("trips/show", {trip: foundTrip});
		}

	});
	
})

// ========================
// COMENTS ROUTES
// ========================

app.get("/trips/:id/comments/new", function(req, res){
	// find trip by id
	Trip.findById(req.params.id, function(err, trip){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {trip: trip});
		}
	})
})

app.post("/trips/:id/comments", function(req, res){
	//lookup trips using ID
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

	



var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
