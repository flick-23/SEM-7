const express = require('express');
const router = express.Router();

router.use('/register-user', require('./user/register-user'));
router.get('/nominee', (req, res) => {
    res.render('user/register-user/nominee', {
        id: null
    })
})
router.use((req, res, next) => {
    console.log(req.user);
    if ((req.isAuthenticated() && req.user.type == 'user') || req.originalUrl == '/user/login')
        next();
    else
        res.redirect('/user/login');
})
router.use('/', require('./user/user'));
router.use('/appointment', require('./user/appointment'))

module.exports = router;