const Joi = require('joi');

// Article validation schemas
const articleSchemas = {
    create: Joi.object({
        title: Joi.string()
            .min(3)
            .max(200)
            .pattern(/^[a-zA-Z0-9\s\-,:?!.'"]+$/)
            .required()
            .messages({
                'string.empty': 'Title is required',
                'string.min': 'Title must be at least 3 characters',
                'string.max': 'Title must not exceed 200 characters',
                'string.pattern.base': 'Title contains invalid characters',
            }),

        original_url: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required()
            .messages({
                'string.empty': 'Original URL is required',
                'string.uri': 'Must be a valid URL starting with http:// or https://',
            }),

        original_content: Joi.string()
            .min(50)
            .max(50000)
            .required()
            .messages({
                'string.empty': 'Original content is required',
                'string.min': 'Original content must be at least 50 characters',
                'string.max': 'Original content must not exceed 50,000 characters',
            }),

        updated_content: Joi.string()
            .max(50000)
            .allow('', null)
            .optional()
            .messages({
                'string.max': 'Updated content must not exceed 50,000 characters',
            }),

        references: Joi.array()
            .items(
                Joi.string().uri({ scheme: ['http', 'https'] }).messages({
                    'string.uri': 'Each reference must be a valid URL',
                })
            )
            .max(10)
            .optional()
            .messages({
                'array.max': 'Maximum 10 references allowed',
            }),
    }),

    update: Joi.object({
        title: Joi.string()
            .min(3)
            .max(200)
            .pattern(/^[a-zA-Z0-9\s\-,:?!.'"]+$/)
            .messages({
                'string.min': 'Title must be at least 3 characters',
                'string.max': 'Title must not exceed 200 characters',
                'string.pattern.base': 'Title contains invalid characters',
            }),

        original_url: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .messages({
                'string.uri': 'Must be a valid URL starting with http:// or https://',
            }),

        original_content: Joi.string()
            .min(50)
            .max(50000)
            .messages({
                'string.min': 'Original content must be at least 50 characters',
                'string.max': 'Original content must not exceed 50,000 characters',
            }),

        updated_content: Joi.string()
            .max(50000)
            .allow('', null)
            .messages({
                'string.max': 'Updated content must not exceed 50,000 characters',
            }),

        references: Joi.array()
            .items(
                Joi.string().uri({ scheme: ['http', 'https'] }).messages({
                    'string.uri': 'Each reference must be a valid URL',
                })
            )
            .max(10)
            .messages({
                'array.max': 'Maximum 10 references allowed',
            }),
    }).min(1), // At least one field must be provided for update
};

module.exports = articleSchemas;
