const joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const options = {
            abortEarly: false,  
            allowUnknown: true, 
            stripUnknown: true  
        };

        const { error, value } = schema.validate(req.body, options);

        if (error) {
            console.log(error);
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                details: error.details.map(err => err.message)
            });
            
        }

        req.body = value; 
        next();
    };
};

module.exports = validate;
