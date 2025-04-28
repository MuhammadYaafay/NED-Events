const { body } = require("express-validator");


//validation for registration
const regiserValidation = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),
  body("role")
    .optional()
    .isIn(["attendee", "vendor", "organizer"])
    .withMessage("invalid role"),
];

//for login
const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  regiserValidation,
  loginValidation,
};
