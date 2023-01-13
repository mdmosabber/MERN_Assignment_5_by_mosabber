const router = require('express').Router();
const registerController = require('../controllers/RegisterController');
const authVerify = require('../middleware/auth')

router.get('/',registerController.index);
router.post('/register',registerController.register);
router.post('/login',registerController.userLogin);
router.get('/logout',registerController.logOut);

router.get('/profile',authVerify,registerController.viewProfile);
router.patch('/update-profile',authVerify,registerController.updateProfile);


module.exports = router;