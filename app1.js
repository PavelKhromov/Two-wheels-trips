var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	Trip           = require("./models/trip"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         =require("./seeds")

//mongoose.connect("mongodb://localhost:/two_wheels_trips"); 
//{useNewUrlParser: true});

mongoose.connect('mongodb://127.0.0.1:27017/two_wheels_trips', { useMongoClient: true, promiseLibrary: global.Promise });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION 
app.use(require("express-session")({
	secret: "My secret text is here!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



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
// COMMENTS ROUTES
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

	
// ============
// AUTH ROUTES
// ============

// SHOW REGISTER FORMS
app.get("/register", function(req, res){
	res.render("register");

});

// HANDLE SIGN UP LOGIC
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/trips");
		});
	});
}); 


// SHOW LOGIN FORM
app.get("/login", function(req, res){
	res.render("login");
});

// HANDLE LOGIN LOGIC
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/trips",
		failureRedirect: "/login"
	}), function(req, res){
});

// LOGIN OUT ROUTE
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/trips");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//app.listen(process.env.PORT, process.env.IP, function () {
	//console.log("SERVER STARTED NEW");
//});
  //console.log("Server Has Started!");

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
