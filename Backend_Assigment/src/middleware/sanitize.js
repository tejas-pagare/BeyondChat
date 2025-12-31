const sanitizeInput = (req, res, next) => {
    // Remove any potential MongoDB operators from request body
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                // Remove keys starting with $ (MongoDB operators)
                if (key.startsWith('$')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            });
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }

    next();
};

module.exports = sanitizeInput;
