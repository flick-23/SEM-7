//Radiologist Routes
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ehrRadiologist = require('../../FabricHelperRadiologist');
const User = require("../../models/user");
const AadhaarUser = require('../../models/aadhaaruser');
const Data = require('../../models/data');
const axios = require('axios');
const keccak256 = require('keccak256');
const fileUpload = require("express-fileupload");
var fs = require("fs");
var rp = require('request-promise');
const app = express();


//All routes have prefix '/organisation/radiologist'
router.get('/login', function (req, res) {
  res.render('org/org-login', {
    org: 'radiologist'
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/organisation/radiologist',
  failureRedirect: '/organisation/radiologist/login'
}), function (req, res) {});


router.use((req, res, next) => {
  if (req.user.type == 'radiologist')
    next();
  else
    res.redirect('/');
});

router.get('/', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});


router.get('/medicalID', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null,
  });
});

router.post('/medicalID', function (req, res) {
  let AadhaarNo = req.body.medicalID;
  app.set('aadhaar', AadhaarNo);
  let hash = keccak256(AadhaarNo).toString('hex')
  let MedicalID = hash;
  let doc = {
    'medicalID': MedicalID,
    'aadhaarNo': AadhaarNo
  }
  console.log(doc)
  User.findOne({
    _id: MedicalID
  }, function (err, found) {
    if (err || !found)
      return res.render('org/radiologistPortal', {
        details: {},
        error: res.__('messages.error'),
        message: null,
      })
    let perm = found.permission.indexOf(req.user._id) + 1;
    if (perm) {
      console.log(doc)
      ehrRadiologist.getReport(req, res, doc);
    } else {
      res.render("org/radiologistPortal", {
        details: {},
        error: res.__('messages.noAccess'),
        message: null
      })
    }
  });
});

router.get('/addreport', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});


//image upload

router.post('/addreport', async function (req, res) {
  var file = req.files.reportImg;
  var fileName = file.name;
  let base64 = 'data:image/jpeg;base64,' + file.data.toString('base64');
  var options = {
    method: 'POST',
    uri: 'https://earogya-ipfs.herokuapp.com/post',
    form: {
      img: base64
    },
    headers: {
      /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
    }
  };

  rp(options)
    .then(async function (response) {
      let imglink = JSON.parse(response);
      const aadhaarno = app.get('aadhaar');
      const MedicalID = keccak256(aadhaarno).toString('hex')
      let Diagnosis = req.body.diagnoses;
      let report = Diagnosis;
      let links = 'https://earogya-ipfs.herokuapp.com/photo/' + imglink.rid;
      let addedBy = req.user._id;
      let doc = {
        'medicalID': MedicalID,
        'report': report,
        'links': links,
        'addedby': addedBy,
        'aadhaarNo': aadhaarno
      }
      const user = await (AadhaarUser.findOne({
        aadhaarNo: aadhaarno
      }))
      const address = user.address.split(',')
      const state = address[address.length - 1]
      const disease = Diagnosis
      let info = new Data({
        state: state,
        disease: disease
      })
      info.save((err, response) => {
        if (err) {
          res.send(err)
        } else {
          console.log('done')
        }
      })
      ehrRadiologist.addrLReport(req, res, doc);
    })
    .catch(function (err) {
      res.send(err)
    });
})


router.get('/getreport', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/getreport', function (req, res) {
  const aadhaarno = app.get('aadhaar');
  let medicalID = keccak256(aadhaarno).toString('hex')
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrRadiologist.getReport(req, res, doc);
});

router.get('/addprescription', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/addprescription', function (req, res) {
  const aadhaarno = app.get('aadhaar');
  let medicalID = keccak256(aadhaarno).toString('hex')
  let prescription = req.body.prescription;
  let addedBy = req.user._id
  let doc = {
    'medicalID': medicalID,
    'prescription': prescription,
    'addedby': addedBy,
    'aadhaarNo': aadhaarno
  }
  ehrRadiologist.addMedicineReport(req, res, doc);
});

router.get('/getprescription', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/getprescription', function (req, res) {
  const aadhaarno = app.get('aadhaar');
  let medicalID = keccak256(aadhaarno).toString('hex')
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrRadiologist.getMedicineRecord(req, res, doc);
});

router.get('/reporthistory', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/reporthistory', function (req, res) {
  const aadhaarno = app.get('aadhaar');
  let medicalID = keccak256(aadhaarno).toString('hex')
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrRadiologist.getRecord(req, res, doc);
});

router.get('/medicinehistory', function (req, res) {
  res.render('org/radiologistPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/medicinehistory', function (req, res) {
  const aadhaarno = app.get('aadhaar');
  let medicalID = keccak256(aadhaarno).toString('hex')
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrRadiologist.getMedicineRecord(req, res, doc);
});

module.exports = router;