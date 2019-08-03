const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/trips", function(req, res){
	var trips = [
		{name: "Seven Lakes", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Catskills", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Mount Washington", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"},
		{name: "Bushkills Falls", image: "https://climatecommunication.yale.edu/wp-content/uploads/2017/04/001-stone-circle-jpeg-768x350.jpg"}
	]

	res.render("trips", {trips:trips});
});

app.post("/trips", function(req, res){
	// get data from form and add 
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});