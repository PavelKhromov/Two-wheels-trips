var express = require("express");
var app = express();
var bodyParser = require("body-parser"); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var trips = [
		{name: "Seven Lakes", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Catskills", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Catskills", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Mount Washington", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Mount Washington", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Bushkills Falls", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"}
];

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/trips", function(req, res){
	

	res.render("trips", {trips:trips});
});

app.post("/trips", function(req, res){
	
	// get data from form and add and add to trips array
	var name = req.body.name;
	var image = req.body.image;
	var newTrips = {name: name, image: image}
	trips.push(newTrips);
	// redirect back to trips page
	res.redirect("/trips");
});

app.get("/trips/new", function(req, res){
	res.render("new.ejs");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});