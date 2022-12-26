//Central Authority Routes
const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator')
const passport = require('passport');
let passGen = require('password-generator');
const nodemailer = require('nodemailer');
const AadhaarUser = require('../../models/aadhaaruser');
const User = require('../../models/user');
const Organisation = require('../../models/organisation');
const ehrClinician = require('../../FabricHelperClinician');
const keccak256 = require('keccak256');

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "1a1ba2ed87ffc9",
        pass: "58fb2497be2afa"
    }
});

//All routes have prefix '/organisation/centauth'
router.get('/login', function (req, res) {
    res.render('org/org-login', {
        org: 'centauth'
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/organisation/centauth',
    failureRedirect: '/organisation/centauth/login'
}), function (req, res) {

});

router.use((req, res, next) => {
    if (req.user.type == 'centauth')
        next();
    else
        res.redirect('/');
});

router.get('/', (req, res) => {
    Organisation.find({})
        .where('accepted').equals(false)
        .exec((err, orgs) => {
            res.locals.orgs = orgs;
            res.render('org/centAuth', {
                details: {},
                errors: [],
                message: null
            });
        })
});

router.post('/', [check('aadhaarNum').isLength(12).withMessage('Please enter a valid 12 digit Aadhaar Number').matches(/\d/).withMessage('Your Aadhaar number can only contain numbers')], function (req, res) {
    let errors = validationResult(req);
    let aadhaarNum = req.body.aadhaarNum.trim().replace(/ /g, '');
    AadhaarUser.findOne({
        aadhaarNo: aadhaarNum
    }, (err, doc) => {
        if (doc == null) {
            res.render('org/centAuth', {
                details: {
                    found: null
                },
                errors: errors.array(),
                message: null
            })
        } else {
            let details = doc.toJSON()
            details.aadhaarNo = keccak256(details.aadhaarNo).toString('hex')
            ehrClinician.createRecord(req, res, details);
            // User.register(new User({
            //     _id: details.aadhaarNo,
            //     username: details.name.replace(' ', '').toLowerCase() + details.aadhaarNo.slice(0, 4),
            //     email: details.email,
            //     phone: details.phoneNumber,
            //     type: 'user'
            // }), details.name.replace(' ', '').toLowerCase() + details.aadhaarNo.slice(0, 4), (err, user) => {
            //     if (err) {
            //         console.log(err.message);
            //         res.render('org/centAuth', {
            //             details: doc,
            //             errors: [{
            //                 msg: res.__('messages.duplicate')
            //             }]
            //         });
            //     } else {
            //         console.log(typeof (details));
            //         ehrClinician.createRecord(req, res, details);
            //     }
            // })
            console.log('Found:', details);
        }
    })

});

router.post('/accept-application', (req, res) => {
    let org = req.body.org;
    let password = passGen(12, false, /\w/);
    const mailOptions = {
        from: '"eAarogya" <help.eaarogya@gmail.com>',
        to: org.email,
        subject: 'Your eAarogya application was accepted!',
        html: `
              <p>Greetings, ${org.name}!<p>
              <p>Your application for eAarogya has been processed and accepted. Your organisational account is now active. Please visit the link below to sign in and start using our services:</p> 
              <a style="background: #0f4c75; color: #fff; padding: 10px; border-radius: 10px; text-decoration: none;" href="http://localhost:3000/">Launch website</a>
              <br><br>
              <p>Please use the following credentials to log in:</p>
              <p>Username: <span style="color: #0f4c75;">${org.email}</span></p>
              <p>Password: <span style="color: #0f4c75;">${password}</span></p>
              <br>
              <p>Regards,</p>
              <p>The eAarogya Team</p>
              `
    };
    User.register(new User({
        _id: org._id,
        name: org.name,
        username: org.email,
        phone: org.mobile,
        type: 'org'
    }), password, (err, user) => {
        if (err)
            res.sendStatus(500);
        Organisation.findOneAndUpdate({
            _id: org._id
        }, {
            $set: {
                accepted: true
            }
        }, (err, doc) => {
            if (err)
                return res.sendStatus(500)
            transport.sendMail(mailOptions);
            res.sendStatus(200);
        })
    })
})

router.post('/reject-application', (req, res) => {
    const mailOptions = {
        from: '"eAarogya" <help.eaarogya@gmail.com>',
        to: req.body.email,
        subject: 'Regarding your application for eAarogya!',
        html: `
              <p>Hello,<p>
              <p>We are sorry to say that your application for eAarogya has been processed and was rejected.</p>
              <p>Your application was rejected for the following reason:</p> 
              <p><b>${req.body.reason}</b></p>
              <br>
              You can file an application again by rectifying the above error.
              <br>
              <p>Regards,</p>
              <p>The eAarogya Team</p>
              `
    };
    transport.sendMail(mailOptions);
    Organisation.findOneAndDelete({
        _id: req.body.id
    }, (err, doc) => {
        if (err)
            return res.sendStatus(500);
        res.sendStatus(200);
    })
})


module.exports = router;