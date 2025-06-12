/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require('./database/');
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const invController = require("./controllers/invController");
const static = require("./routes/static");
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const utilities = require('./utilities');
const baseController = require("./controllers/baseController");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(utilities.checkJWTToken)

app.use(async (req, res, next) => {
  const nav = await utilities.buildNavigation();// fetch or generate nav HTML
  res.locals.nav = nav;
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/

app.use(static);

// index route
//app.get("/", function(req, res){
  //res.render("index", {title: "Home"})
//})

// Index route
//app.get("/", utilities.handleErrors(baseController.buildHome))

//app.get("/", invController.buildHome);

app.get("/", utilities.handleErrors(baseController.buildHome));

app.get("/favicon.ico", (req, res) => res.status(204));

// Inventory routes
app.use("/inv", inventoryRoute)

//Account route
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.buildNavigation()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

//app.use((err, req, res, next) => {
  //console.error(err.stack);
  //res.status(500).render('errors/error', {
    //title: 'Server Error',
    //message: err.message
  //});
//});
