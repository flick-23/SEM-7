const express = require('express');
const router = express.Router();
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const upload = require("express-fileupload");
const Organisation = require('../models/organisation');


router.get('/register', (req, res) => {
    res.render('org/org-reg', {
        results: [],
        message: 'We use the National Hospital Directory to authenticate your organisation. Please make sure you are registered on the National Health Portal and enter your organisation name as recorded there.'
    })
});

router.post('/register', (req, res, next) => {
    const file = fs.createReadStream(path.join(__dirname, '..', 'public', 'files', 'hospital_directory.csv'));
    let pin = req.body.pin;
    let name = req.body.name.toLowerCase();
    matches = [];
    Papa.parse(file, {
        delimiter: ',',
        complete: function (results) {
            let data = results.data;
            for (let i = 1, l = data.length; i < l; i++) {
                if (data[i][3].toLowerCase() == name && data[i][11] == pin) {
                    return res.render('org/org-reg', {
                        results: [data[i]],
                        message: '1 match found'
                    });
                }
                if (data[i][11] == pin) {
                    matches.push(data[i])
                }
            }
            res.render('org/org-reg', {
                results: matches,
                message: 'No exact match found. Were you looking for one of these?'
            });
        }
    })
})

router.post('/submit-application', (req, res) => {
    let file = req.files.file
    Organisation.create({
        name: req.body.name,
        state: req.body.state,
        district: req.body.district,
        location: req.body.loc,
        pin: req.body.pin,
        phone: req.body.phone,
        mobile: req.body.mobile,
        email: req.body.email,
        regNo: req.body.regNo,
        regFile: file.name
    });
    file.mv('public/files/' + file.name, function (err) { // moving file to uploads folder
        if (err) { // if error occurs run this
            console.log("File was not uploaded!!");
            res.send(err);
        } else {
            console.log("file uploaded");
        }
    });
    res.render('org/org-reg', {
        results: [],
        message: 'Application successfully submitted!'
    });
});


router.use((req, res, next) => {
    if (req.user || /login/.test(req.originalUrl))
        next();
    else
        res.redirect('/professional');
});
router.use('/centauth', require('./organisation/centauth'));
router.use('/testcenter', require('./organisation/testcenter'));
router.use('/clinician', require('./organisation/clinician'));
router.use('/pharmacist', require('./organisation/pharmacist'));
router.use('/healthcareprovider', require('./organisation/hcp'));
router.use('/radiologist', require('./organisation/radiologist'));
router.use('/researcher', require('./organisation/researcher'));


module.exports = router;