const otpModel = require('../models/otp.model')
const userModel=require('../models/normalUser.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mailService = require('../services/otp.service')

const getOtp = async (req, res) => {
    if (!req.body.email || !req.body.username) {
        return res.status(400).json({
            message: "Credentials not found"
        })
    }
    const { email, username } = req.body;
    const generatedOtp = crypto.randomInt(100000, 1000000).toString()
    const hashedOtp = await bcrypt.hash(generatedOtp, 7)

    await otpModel.deleteMany({
        email: email
    })

    try {
        await mailService.sendMail(username, email, generatedOtp)

        await otpModel.create({
            email: email,
            otp: hashedOtp
        })
        res.status(201).json({
            message: "OTP sent "
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error"
        })
    }

}

const verifyOtp = async (req, res) => {
    if (!req.body.email || !req.body.username || !req.body.otp) {
        return res.status(400).json({
            message: "Credentials not found"
        })
    }
    const { email, otp } = req.body;
    const OTP = await otpModel.findOne({
        email: email
    })
    if (!OTP) {
        return res.status(404).json({
            message: "OTP expired or not found"
        })
    }
    if (Date.now() > OTP.exp.getTime() + 5 * 60 * 1000) {
        await OTP.deleteOne()
        return res.status(404).json({
            message: "OTP Expired"
        })
    }

    const isMatched = await bcrypt.compare(otp, OTP.otp)
    if (!isMatched) {
        return res.status(400).json({
            message: "OTP not matching"
        })
    }
    await OTP.deleteOne();
    res.status(200).json({
        message: "OTP verified successfully"
    })
}

const resendOtp = async (req, res) => {
    if (!req.body.email || !req.body.username) {
        return res.status(400).json({
            message: "Credentials not found"
        })
    }
    const { username, email } = req.body;
    const newGeneratedOtp = crypto.randomInt(100000, 1000000).toString()
    const newHashedOtp = await bcrypt.hash(newGeneratedOtp, 7)
    const otpUser = await otpModel.findOne({
        email: email
    })

    if (!otpUser) {
        return res.status(400).json({
            message: "Email not found"
        })
    }

    try {
        await mailService.sendMail(username, email, newGeneratedOtp)

        await otpUser.updateOne({
            otp: newHashedOtp,
            exp: new Date()
        })

        res.status(200).json({
            message: "OTP resent successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "OTP not sent"
        })
    }
}

const getOtpChangePassword=async(req,res)=>{
    if(!req.body.username ||!req.body.email){
        return res.status(404).json({
            message:"Credentials not found"
        })
    }
    const { username, email } = req.body

    const user = await userModel.findOne({
             username: username ,
             email: email 
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }
    if(!user.verified){
        return res.status(401).json({
            message: "User not verified"
        })
    }
    const generatedOtp = crypto.randomInt(100000, 1000000).toString()
    const hashedOtp = await bcrypt.hash(generatedOtp, 7)

    await otpModel.deleteMany({
        email: email
    })

    try{
        await mailService.cofirmMail(username,email,generatedOtp)
        await otpModel.create({
            email:email,
            otp:hashedOtp
        })
        res.status(201).json({
            message:"OTP sent successfully"
        })
    } catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal error"
        })
    }

}

module.exports = { getOtp, verifyOtp, resendOtp ,getOtpChangePassword};