const { body, validationResult } = require('express-validator');

// Middleware for validating registration data
const validateRegister = [
    
	body('username')
		.notEmpty().withMessage('Username is required')
		.isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
	body('email')
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Email is invalid'),
	body('password')
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	}
];

const validateLogin = [
   
    body('email')
    .isEmail().withMessage('Email is invalid'),
    body('password')
    .notEmpty().withMessage('Password is required'),
    (req , res , next)=>{
        const errors  = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next();
    }
]

const validateAddAddress = [
	body('street')
	.optional(),
	body('city')
	.notEmpty().withMessage('City is required'),
	body('state')
	.notEmpty().withMessage('State is required'),
	body('country')
	.notEmpty().withMessage('Country is required'),
	body('zip')
	.notEmpty().withMessage('Zip is required'),
	body('isDefault')
	.optional(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}	
		next();
	}
]
module.exports = { validateRegister , validateLogin , validateAddAddress };