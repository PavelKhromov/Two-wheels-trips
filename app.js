var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/two_wheels_trips");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//SCHEMA SETUP

var tripsSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Trips = mongoose.model("Trips", tripsSchema);

// Trips.create(
// {
// 	name: "Seven Lakes",
// 	image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"


// }, function(err, trips){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("newly created trip: ");
// 		console.log(trips);
// 	}
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// var trips = [
// 		{name: "Seven Lakes", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
// 		{name: "Catskills", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
// 		{name: "Catskills", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
// 		{name: "Mount Washington", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
// 		{name: "Mount Washington", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
// 		{name: "Bushkills Falls", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"}
// ];

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/trips", function(req, res){
	// Get all trips from DB
	Trips.find({}, function(err, allTrips){
		if(err){
			console.log(err);
		} else {
			res.render("trips", {trips:allTrips});
		}
	});
	
});

app.post("/trips", function(req, res){
	
	// get data from form and add and add to trips array
	var name = req.body.name;
	var image = req.body.image;
	var newTrips = {name: name, image: image}
	// Create a new trip and save to the DB
	Trips.create(newTrips, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/trips");
		}
	});
});

app.get("/trips/new", function(req, res){
	res.render("new.ejs");
});



var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});