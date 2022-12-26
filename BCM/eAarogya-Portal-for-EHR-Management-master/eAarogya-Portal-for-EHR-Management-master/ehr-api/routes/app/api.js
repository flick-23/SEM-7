const express = require("express");
const router = express.Router();
const passport = require("passport");
const ehrUser = require("../../FabricHelperUser");
const User = require("../../models/user");

//All routes have prefix /app
router.post("/login", passport.authenticate("local", {}), (req, res) => {
    if (req.user) {
        let user = req.user.toObject()
        delete user.salt;
        delete user.hash;
        res.send({
            user: user
        });
    } else {
        res.sendStatus(401);
    }
});

router.post('/give-permission', (req, res) => {
    let DoctorID = req.body.doctorID;
    User.findOne({
        username: req.body.username
    }, function (err, doc) {
        if (err)
            res.sendStatus(400);
        let user = doc;
        user.permission.push(DoctorID);
        user.save();
        console.log(user);
        res.status(200).send({
            message: 'Permission granted'
        });
    });
});

router.post('/revoke-permission', (req, res) => {
    let DoctorID = req.body.doctorID;
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        let idx = user.permission.indexOf(DoctorID);
        if (idx != -1) {
            user.permission.splice(idx, 1);
            user.save()
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });
});

router.post('/view-permissions', (req, res) => {
    User.findOne({
            username: req.body.username
        }, 'permission')
        .populate('permission', 'name org type')
        .exec((err, info) => {
            if (err)
                return res.sendStatus(400);
            console.log(info);
            res.status(200).send({
                permissions: info.permission
            });
        })
});

router.post('/report-history', (req, res) => {
    let medicalID = req.body.medicalID;
    let doc = {
        'medicalID': medicalID,
        'mobile': true
    }
    ehrUser.getRecord(req, res, doc);
});


router.post('/prescription-history', (req, res) => {
    let medicalID = req.body.medicalID;
    let doc = {
        'medicalID': medicalID,
        'mobile': true
    }
    ehrUser.getMedicineRecord(req, res, doc);
});

module.exports = router;