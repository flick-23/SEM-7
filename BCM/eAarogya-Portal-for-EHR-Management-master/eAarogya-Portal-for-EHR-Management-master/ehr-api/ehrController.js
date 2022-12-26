var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var ehr = require("./FabricHelper")


// createRecord
router.post('/createRecord', function(req, res) {

    ehr.createRecord(req, res);

});

// addReport
router.post('/addReport', function(req, res) {

    ehr.addReport(req, res);

});

// getReport
router.post('/getReport', function(req, res) {

    ehr.getReport(req, res);

});

// getRecord
router.post('/getRecord', function(req, res) {

    ehr.getRecord(req, res);

});

//createMedicineRecord
router.post('/createMedicineRecord', function(req, res) {

    ehr.createRecord(req, res);

});

//addMedicineReport
router.post('/addMedicineReport', function(req, res) {

    ehr.addMedicineReport(req, res);

});

//addrLReport
router.post('/addrLReport', function(req, res) {

    ehr.addrLReport(req, res);

});

//getMedicineRecord
router.post('/getMedicineRecord', function(req, res) {

    ehr.getMedicineReport(req, res);

});

//getMedicineReport
router.post('/getMedicineReport', function(req, res) {

    ehr.getMedicineReport(req, res);

});


module.exports = router;