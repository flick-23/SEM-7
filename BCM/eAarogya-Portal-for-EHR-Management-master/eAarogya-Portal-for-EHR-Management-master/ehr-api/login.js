var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var UserTwo = require("./models/user2");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect("mongodb://localhost/permission_appfinal", {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "India is my country I love my country",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//User.plugin(passportLocalMongoose);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("index");
});

//============USER ROUTES=============

app.get("/users/register", function(req, res){
    res.render("registerUser");
});
app.post("/users/register", function(req, res){

    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            })
        }
    });
});

app.get("/users/login", function(req,res){
    res.render("userLogin");
});
app.post("/users/login", passport.authenticate("local" ,{
    successRedirect: "/users/givePermission",
    failureRedirect: "/user/login"
}), function(req, res){
});

app.get("/users/givePermission",isLoggedIn, function(req, res){
   res.render("userPermission");
});
app.post("/users/givePermission", function(req, res){
    var DoctorID = req.body.doctorID;
    var MedicalID = req.body.medicalID;
    console.log(DoctorID);
    User.findOne({username: DoctorID},(function(err, foundorg){
        var org = foundorg;
        org.permission.push(MedicalID);
        org.save();
        console.log(org);
    }));
});

//===============ORGANISATION ROUTE================
app.get("/organisation/register", function(req, res){
    res.render("registerOrganisation");
});

app.post("/organisation/register", function(req, res){
    var Username = req.body.username;
    User.register(new User({username: Username}), req.body.password, function(err, org){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

app.get("/organisation/login", function(req, res){
    res.render("organisationLogin");
});
app.post("/organisation/login", passport.authenticate("local",{
    successRedirect: "/organisation/addreport",
    failureRedirect: "/organisation/login"
}), function(req, res){

});

app.get("/organisation/addreport",isLoggedIn, function(req, res){
    res.render("addreport");
});
app.post("/organisation/addreport", function(req, res){
    var MedicalID = req.body.medicalID;
    var DoctorID = req.body.doctorID;
    User.findOne({username: DoctorID}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            var arr = foundUser.permission;
            for(var i = 0; i<arr.length; i++){
                if(arr[i]==MedicalID){
                    console.log(arr[i]);
                    console.log("found");
                    break;
                } else {
                    console.log("failed");
                }
            }
        }
    });
});

app.get("/users/removepermission",isLoggedIn, function(req, res){
    res.render("removepermission");
});
app.post("/users/removepermission", function(req, res){
    var MedicalID = req.body.medicalID;
    var DoctorID = req.body.doctorID;
    User.findOne({username: DoctorID}, function(err, foundOrg){
        if(err){
            console.log(err);
        } else {
            for( var i = 0; i < foundOrg.permission.length; i++){
                if ( foundOrg.permission[i] === MedicalID) {
                  foundOrg.permission.splice(i, 1);
                  foundOrg.save();
                  break;
                } else {
                    console.log("Not found");
                }
             }
             console.log(foundOrg);
        }
    });
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.listen(3000, function(){
    console.log("Server running");
});
