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

const validateEventCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Event description is required')
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  
  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format'),
  
  body('end_date')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['technology', 'business', 'arts', 'food', 'sports', 'health', 'education', 'other'])
    .withMessage('Invalid category'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  
  body('ticket_price')
    .notEmpty().withMessage('Ticket price is required')
    .isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),
  
  body('ticket_max_quantity')
    .notEmpty().withMessage('Ticket quantity is required')
    .isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
  
  body('has_stall')
    .isBoolean().withMessage('Has stall must be true or false'),
  
  body('stall_price')
    .if(body('has_stall').equals('true'))
    .notEmpty().withMessage('Stall price is required when has_stall is true')
    .isFloat({ min: 0 }).withMessage('Stall price must be a positive number'),
  
  body('stall_max_quantity')
    .if(body('has_stall').equals('true'))
    .notEmpty().withMessage('Stall quantity is required when has_stall is true')
    .isInt({ min: 1 }).withMessage('Stall quantity must be at least 1'),
  
  body('image')
    .optional()
    .isString().withMessage('Image must be a base64 string')
];

module.exports = {
  regiserValidation,
  loginValidation,
  validateEventCreation,
};
