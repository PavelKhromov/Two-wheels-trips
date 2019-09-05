var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Trip  = require("./models/trip"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

    var commentRoutes  = require("./routes/comments"),
        tripRoutes     = require("./routes/trips"),
        indexRoutes    = require("./routes/index") 
    
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
    secret: "Once again Rusty wins cutest dog!",
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

app.use(indexRoutes);
app.use(tripRoutes);
app.use("/trips/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});