const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_APP_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD
    }
});

const sendMail = async (username, email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_APP_EMAIL,
            to: email,
            subject: "Security Email Regarding verification of your email",
            html: `
        <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        
        <div style="
            max-width:600px;
            margin:auto;
            background:white;
            border-radius:10px;
            padding:30px;
            box-shadow:0 0 10px rgba(0,0,0,.1);
        ">

            <h2 style="color:#1DB954;">
                Welcome ${username} 
            </h2>

            <p>
                Thank you for registering.
            </p>

            <p>
                Please use the following OTP to verify your email:
            </p>

            <div style="
                text-align:center;
                margin:30px 0;
            ">
                <span style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:6px;
                    color:#1DB954;
                ">
                    ${otp}
                </span>
            </div>

            <p>
                This OTP will expire in <b>5 minutes</b>.
            </p>

            <p>
                If you didn't create an account,
                you can safely ignore this email.
            </p>

            <hr>

            <small>
                Spotify Backend Project
            </small>

        </div>

    </body>
    </html> `
        })
        console.log("Email Sent")
    }
    catch (err) {
        throw new Error(err);
    }
}

const cofirmMail = async (username, email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_APP_EMAIL,
            to: email,
            subject: "Security Email Regarding Password Change",
            html: `
        <!DOCTYPE html>
        <html>
         <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        
        <div style="
            max-width:600px;
            margin:auto;
            background:white;
            border-radius:10px;
            padding:30px;
            box-shadow:0 0 10px rgba(0,0,0,.1);
        ">

            <h2 style="color:#1DB954;">
                Hello ${username} 
            </h2>

            <p>
                You have opted for changing your password
            </p>

            <p>
                Please use the following OTP to proceed further:
            </p>

            <div style="
                text-align:center;
                margin:30px 0;
            ">
                <span style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:6px;
                    color:#1DB954;
                ">
                    ${otp}
                </span>
            </div>

            <p>
                This OTP will expire in <b>5 minutes</b>.
            </p>

            <p>
                If you haven't opted for this,
                contact us.
            </p>

            <hr>

            <small>
                Spotify Backend Project
            </small>

        </div>
    </body>
    </html> `
        })
        console.log("Email Sent")
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = { sendMail, cofirmMail};