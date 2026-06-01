const express=require('express')
const authController=require('../controllers/auth.controller')
const OTPController=require('../controllers/otp.controller')
const validator=require('../middlewares/auth.validator')

const router=express.Router()

router.post('/getOtp',validator.OTPValidationRules,OTPController.getOtp)
router.post('/verifyOtp',validator.OTPValidationRules,OTPController.verifyOtp)
router.post('/register',validator.registerUserValidationRules,authController.userRegister)
router.post('/login',validator.loginUserValidationRules,authController.userLogin)
router.post('/logout',authController.userLogout)
router.post('/logoutall',authController.userLogoutAll)

router.post('/refresh',authController.getAccessToken)



module.exports=router;