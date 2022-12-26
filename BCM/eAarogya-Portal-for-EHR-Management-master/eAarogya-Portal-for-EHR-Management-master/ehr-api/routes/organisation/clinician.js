//Clinician Routes
const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const ehrClinician = require('../../FabricHelperClinician');
const User = require("../../models/user");
const AadhaarUser = require('../../models/aadhaaruser');
const Data = require('../../models/data');
const keccak256 = require('keccak256');

//All routes have prefix '/organsation/clinician'
router.get('/login', function (req, res) {
  res.render('org/org-login', {
    org: 'clinician'
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/organisation/clinician',
  failureRedirect: '/login'
}), function (req, res) {});

router.use((req, res, next) => {
  if (req.user.type == 'clinician')
    next();
  else
    res.redirect('/');
});

router.get('/', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});


router.get('/medicalID', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/medicalID', function (req, res) {
  var AadhaarNo = req.body.medicalID;
  app.set('aadhaar', AadhaarNo);
  var hash = keccak256(AadhaarNo).toString('hex');
  let MedicalID = hash;
  let doc = {
    'medicalID': MedicalID,
    'aadhaarNo': AadhaarNo
  }
  User.findOne({
    _id: MedicalID
  }, function (err, found) {
    if (err || !found)
      return res.render('org/clinicianPortal', {
        details: {},
        error: res.__('messages.error'),
        message: null,
      })
    let perm = found.permission.indexOf(req.user._id) + 1;
    if (perm) {
      ehrClinician.getReport(req, res, doc);
    } else {
      res.render("org/clinicianPortal", {
        details: {},
        error: res.__('messages.noAccess'),
        message: null
      })
    }
  });
});


router.get('/addreport', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
})

router.post('/addreport', async function (req, res) {
  let MedicalID = req.body.medicalID;
  let allergies = req.body.allergies;
  let symptoms = req.body.symptoms;
  let diagnosis = req.body.diagnoses;
  let addedBy = req.user._id;
  let report = 'Allergies: ' + allergies + ', Symptoms: ' + symptoms + ', Diagnosis: ' + diagnosis;
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': MedicalID,
    'report': report,
    'addedby': addedBy,
    'aadhaarNo': aadhaarno
  }
  const response = await AadhaarUser.findOne({
    aadhaarNo: aadhaarno
  })
  const address = response.address.split(',')
  const state = address[address.length - 1]
  const disease = diagnosis
  let data = new Data({
    state: state,
    disease: disease
  })
  data.save((err, response) => {
    if (err) {
      res.send(err)
    } else {
      console.log(response)
    }
  })
  ehrClinician.addReport(req, res, doc);
  console.log(MedicalID);
});

router.get('/addprescription', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/addprescription', function (req, res) {
  let medicalID = req.body.medicalID;
  let prescription = req.body.prescription;
  let addedBy = req.user._id
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': medicalID,
    'prescription': prescription,
    'addedby': addedBy,
    'aadhaarNo': aadhaarno
  }
  ehrClinician.addMedicineReport(req, res, doc);
});

router.get('/getreport', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/getreport', function (req, res) {
  let medicalID = req.body.medicalID;
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  };
  ehrClinician.getReport(req, res, doc);
});

router.get('/getprescription', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});
router.post('/getprescription', function (req, res) {
  let medicalID = req.body.medicalID;
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrClinician.getMedicineReport(req, res, doc);
});

router.get('/reporthistory', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});

router.post('/reporthistory', function (req, res) {
  let medicalID = req.body.medicalID;
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrClinician.getRecord(req, res, doc);
});

router.get('/medicinehistory', function (req, res) {
  res.render('org/clinicianPortal', {
    details: {},
    error: null,
    message: null
  });
});
router.post('/medicinehistory', function (req, res) {
  let medicalID = req.body.medicalID;
  const aadhaarno = app.get('aadhaar');
  let doc = {
    'medicalID': medicalID,
    'aadhaarNo': aadhaarno
  }
  ehrClinician.getMedicineRecord(req, res, doc)
});

module.exports = router;