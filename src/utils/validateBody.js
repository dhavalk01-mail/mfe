const createErrors = require('http-errors');
const errorFunction = require('./errorFunction');

module.exports = (validator) => (req, res, next) => {
    try {
        const { error } = validator(req.body);
        // if (error) throw createErrors(400, error.details[0].message);
        // if (error) throw createErrors.BadRequest(error.details[0].message);
        if (error) res.status(400).json(errorFunction(true, error.details[0].message));
        // if (!error) return next();  // continue to the next middleware or route handler.
        // if (!error) return res.status(200).json({ message: 'success' } 
            
        
        next();  // continue to the next middleware or route handler. 
    } catch (error) {
        throw createErrors.BadRequest(error.message);
    }
}