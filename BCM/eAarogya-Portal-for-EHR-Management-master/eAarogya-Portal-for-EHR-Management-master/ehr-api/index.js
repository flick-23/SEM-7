const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const i18n = require("i18n");
const upload = require('express-fileupload');
const cors = require('cors');
const uri =
  "mongodb+srv://test:test@cluster0-2czvc.mongodb.net/ehr?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
i18n.configure({
  locales: ["en", "hi", "ka"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  cookie: "lang",
  objectNotation: true,
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(
  require("express-session")({
    secret: "India is my country I love my country",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000000,
    },
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(i18n.init);
app.use(upload());
app.use(cors());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const organisationRoutes = require("./routes/organisations");
const userRoutes = require("./routes/user");
const appRoutes = require('./routes/app/api');
const smsRoute = require('./routes/sms');

app.use('/app', appRoutes);

app.get("/en", (req, res) => {
  res.cookie("lang", "en");
  res.redirect(req.session.returnTo || "/");
});

app.get("/hi", (req, res) => {
  res.cookie("lang", "hi");
  res.redirect(req.session.returnTo || "/");
});

app.get("/ka", (req, res) => {
  res.cookie("lang", "ka");
  res.redirect(req.session.returnTo || "/");
});

app.use((req, res, next) => {
  langs = {
    en: "English",
    hi: "हिंदी",
    ka: "ಕನ್ನಡ",
  };
  res.locals.lang = langs[req.cookies.lang];
  res.locals.user = req.user;
  req.session.returnTo = req.originalUrl;
  next();
});

app.use("/organisation", organisationRoutes);
app.use("/user", userRoutes);
app.use("/sms", smsRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/professional", (req, res) => {
  res.render("professionalIndex");
});

app.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error')[0]
  });
});

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  if (req.user.type == 'user')
    res.redirect('/user');
  else if (req.user.type == 'hcp')
    res.redirect('/organisation/healthcareprovider');
  else
    res.redirect(`/organisation/${req.user.type}`);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  User.register(
    new User({
      _id: req.body.id,
      username: req.body.username,
      org: req.body.org,
      type: req.body.type,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
        });
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});