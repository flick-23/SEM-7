//Researcher Routes
const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const Data = require('../../models/data')
const User = require('../../models/user')
const ehrResearcher = require('../../FabricHelperResearcher');
const data = require('../../models/data');
const axios = require('axios');
const config = require('../ethConfig');

const ethInstance = axios.create({
    baseURL: config.api+config.contract,
    timeout: 5000,
    headers: {'X-API-KEY': config.key}
})

//All routes have prefix '/organisation/researcher'

router.get('/login', function (req, res) {
    res.render('org/org-login', {
        org: 'researcher'
     });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/organisation/researcher',
    failureRedirect: '/organisation/researcher/login'
}), function (req, res) {});
router.use((req, res, next) => {
    if (req.user.type == 'researcher')
        next();
    else
        res.redirect('/');
});

router.get('/', function (req, res) {
    res.render('org/researchPortal',{
        org: 'researcher'
    });
});
 
router.get('/diseases', function(req, res){
    res.render('org/diseases');
});

router.get('/states', function(req, res){
    res.render('org/states');

});

router.get('/add-data', (req, res) => {
    res.render('org/add-data');
})

router.post('/add-data', (req, res) => {
    const Bstate = req.body.state
    const Bdisease = req.body.disease
    let data = new Data({
        state: Bstate,
        disease: Bdisease
    })
    data.save((err, data) => {
        if(err){
            console.log(err)
        }
        console.log(data)
        res.render('org/add-data')
    })
})


router.get('/patientsdata', (req, res) => {
    Data.find({}, (err, foundData) => {
        res.json(foundData)
    })
}); 

router.get('/downloadds', async(req, res) => {
    async function getEnabledUsers(Users){
        let enabledUsers = new Array()
        for(let i = 0; i<Users.length; i++){
            if(Users[i].rewards.enabled){
                enabledUsers.push(Users[i]._id)
            }
        }
        return enabledUsers
    }
    async function distributeRewards(users){
        for(let i = 0; i<users.length; i++){
            let foundUser = await User.findOne({_id: users[i]})
            let resp = await ethInstance.post('/mint', {
                account: foundUser.rewards.ethereumAddress,
                amount: 1000
            })
            console.log(resp.data)
        }
    }
    const users = await User.find({type: 'user'})
    const enabledUsers = await getEnabledUsers(users)
    const respo = await distributeRewards(enabledUsers)
    ehrResearcher.getAllUsers(req, res, enabledUsers)
})



module.exports = router; 