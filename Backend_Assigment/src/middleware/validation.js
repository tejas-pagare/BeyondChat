const articleSchemas = require('../validators/articleValidator');

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

// Export validation middleware for different operations
module.exports = {
    validateCreate: validate(articleSchemas.create),
    validateUpdate: validate(articleSchemas.update),
};
