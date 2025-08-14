
if (process.env.NODE_ENV != "production") {
require('dotenv').config();
}
console.log(process.env);


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter= require('./routes/user.js');



const dbUrl = process.env.ATLASDB_URL ;

main()
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// Set up view engine and middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret  : process.env.SECRET,
  },
  touchAfter: 24 * 3600 // time period in seconds after which to update the session
});
store.on("error", function(e) {
  console.log("Session Store Error", e);
} );


const sessionOptions = {
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      //  events client-side JavaScript from accessing the cookie
      },
};

// app.get('/', (req, res) => {
//   res.send("Hi I am root");
// });\



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make currentUser available in all views
  next();
 })


//  app.get("/demouser", async(req, res) => {
//   let fakeUser = new User({ username: "demo", email: "msmsm@gmail.com" });
//   let registeredUser= await User.register(fakeUser, "password");
//   res.send(registeredUser);
//  });

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


// // Catch-all for undefined routes
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// Central error handler
app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err }); // ✅ pass the full error object
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
