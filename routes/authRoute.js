const {userRegister, userLogin} = require('../controller/userController.js');

const router = require('express').Router();

router.post('/register',userRegister);
router.post('/login', userLogin);

module.exports = router;