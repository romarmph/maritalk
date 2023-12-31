const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");

const errors = require("./errors");

const app = express();
const PORT = process.env.PORT | 3000;
const dirname = __dirname;

app.use(express.static(path.join(dirname, "src/css")));
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.message = req.session.message;
  res.locals.success = req.session.success;
  next();
});

require("./startup_routes")(app);

// app.use(errors.handle404);

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
