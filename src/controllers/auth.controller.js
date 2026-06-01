const userModel = require('../models/normalUser.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sessionModel = require('../models/session.model')
const otpModel = require('../models/otp.model')
const sendMail = require('../services/otp.service')
const crypto = require("crypto")

const userRegister = async (req, res) => {

    if (!req.body.verified) {
        return res.status(400).json({
            message: "Email not verified"
        })
    }

    const userExisting = await userModel.findOne({
        $or: [
            { username: req.body.username },     //$or operates does or operator work with multiple conditions 
            { email: req.body.email }
        ]
    })
    if (userExisting) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(req.body.password, 10)  //10 is salt number an unique value
    const user = await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        usertype: req.body.usertype ? req.body.usertype : 'user',
        verified: true
    })


    return res.status(201).json({
        message: "User Created Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            usertype: user.usertype,
            verified: user.verified
        }
    })
}

const userLogin = async (req, res) => {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id,
        role: user.usertype
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        role: user.usertype,
        sessionId: session._id
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json({
        message: "User Logged in Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            usertype: user.usertype,
            verified: user.verified
        },
        accessToken: accessToken
    })
}

const userLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const session = await sessionModel.findOne({
        refreshTokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        revoked: false
    })

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    session.revoked = true
    await session.save()

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    return res.status(200).json({
        message: "User Logged out successfully"
    })
}

const getAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash: refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id,
        role: decoded.role,
        sessionId: session._id
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15m"
    })

    const newRefreshToken = jwt.sign({
        id: decoded.id,
        role: decoded.role
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    })

    session.refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
    })

    return res.status(200).json({
        message: "Access token generated successfully",
        accessToken
    })
}

const userLogoutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    return res.status(200).json({
        message: "User Logged out successfully from all devices"
    })
}

const userForgetPassword = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.newPassword) {
        return res.status(404).json({
            message: "Credentials not found"
        })
    }
    const { username, email, newPassword } = req.body

    const user = await userModel.findOne({
        username: username,
        email: email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }
    if (!user.verified) {
        return res.status(400).json({
            message: "User not verified"
        })
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    try {
        user.updateOne({
            password: newHashedPassword
        })
        return res.status(200).json({
            message: "Password Changed Successfully"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Error"
        })
    }
}
module.exports = { userRegister, userLogin, userLogout, getAccessToken, userLogoutAll, userForgetPassword };