const { body, validationResult } = require('express-validator')

const validateCredentials = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next();
}

const registerUserValidationRules = [
    body("username").isString().withMessage("Username must be a string")
        .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters"),

    body("email").isEmail().withMessage("Invalid Email Address"),

    body("password").isLength({ min: 6 }).withMessage("Password must be atleast 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]+$/).withMessage('Password must contain an uppercase, a number & a special character'),
    validateCredentials
]

const loginUserValidationRules = [
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be atleast 6 characters long"),

    body().custom(({ username, email }) => {
        if (!username && !email) {
            throw new Error("Either username or email must be provided");
        }

        if (username && email) {
            throw new Error("Provide either username or email, not both");
        }

        return true;
    }),

    body("username")
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage("Invalid Username"),

    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid Email Address"),

    validateCredentials
];
module.exports = { registerUserValidationRules, loginUserValidationRules };