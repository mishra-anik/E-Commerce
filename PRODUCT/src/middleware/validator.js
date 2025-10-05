const {body, validationResult} = require('express-validator');

function validationerrorHandler(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}

const validateCreateProduct = [
    body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({min:3}).withMessage('Title must be at least 3 characters long'),
    body('description')
    .optional()
    .notEmpty().withMessage('Description is required')
    .isLength({min:10}).withMessage('Description must be at least 10 characters long'),
    body('priceAmount')
    .notEmpty().withMessage('Price amount is required')
    .isFloat({gt:0}).withMessage('Price amount must be a positive number'),
    body('priceCurrency')
    .optional()
    .isIn(['USD', 'INR', 'EUR']).withMessage('Price currency must be USD, INR, or EUR'),
    validationerrorHandler
]

module.exports = {validateCreateProduct};