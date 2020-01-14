var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    moment         = require('moment'),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Trip           = require("./models/trip"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    mixins         = require('postcss-mixins'),
    seedDB         = require("./seeds")

var commentRoutes  = require("./routes/comments"),
    tripRoutes     = require("./routes/trips"),
    indexRoutes    = require("./routes/index") 

    //new code
// const http = require('http');

// process
//   .on('SIGTERM', shutdown('SIGTERM'))
//   .on('SIGINT', shutdown('SIGINT'))
//   .on('uncaughtException', shutdown('uncaughtException'));

// setInterval(console.log.bind(console, 'tick'), 1000);
// http.createServer((req, res) => res.end('hi'))
//   .listen(process.env.PORT || 3000, () => console.log('Listening'));

// function shutdown(signal) {
//   return (err) => {
//     console.log(`${ signal }...`);
//     if (err) console.error(err.stack || err);
//     setTimeout(() => {
//       console.log('...waited 5s, exiting.');
//       process.exit(err ? 1 : 0);
//     }, 5000).unref();
//   };
// }

    //end


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pavlo:LearnWeb1212@mongodb01-saq2e.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//01.13. code new
//mongoose.connect('mongodb://127.0.0.1:27017/two_wheels_trips', { useMongoClient: true, promiseLibrary: global.Promise });
// 01.13 coe ends
//mongoose.connect("mongodb+srv://pavlo:mysecretcode2020@cluster0-saq2e.mongodb.net/test");

//mongoose.connect('mongodb+srv://pavlo:LearnWeb1212@cluster0-saq2e.mongodb.net/test?retryWrites=true&w=majority');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// -- removed seed for now
app.use(flash());
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(tripRoutes);
app.use("/trips/:id/comments", commentRoutes);


app.listen(8080, () => {
    console.log('Server listening 8080');
});


// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log("Server Has Started!");
// });