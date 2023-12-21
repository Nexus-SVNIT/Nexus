const eventData = require("./models/eventModel.js");
const memberData = require("./models/memberModel.js");
const messageData = require("./models/messageModel.js");
const {
    memberInfoValidationSchema,
    eventValidationSchema,
    messageValidationSchema
} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// Middleware for logging request details
module.exports.logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Move to the next middleware/route handler
};

// Validation middleware for event data
module.exports.validateEventData = (req, res, next) => {
    const { error } = eventValidationSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const statusCode = 400;
        return next(new ExpressError(statusCode, errorMessage));
    }
    next();
};

// Validation middleware for member data
module.exports.validateMemberData = (req, res, next) => {
    const { error } = memberInfoValidationSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const statusCode = 400;
        return next(new ExpressError(statusCode, errorMessage));
    }
    next();
};

// Validation middleware for message data
module.exports.validateMessageData = (req, res, next) => {
    const { error } = messageValidationSchema.validate(req.body);
    

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const statusCode = 400;
        return next(new ExpressError(statusCode, errorMessage));
    }
    next();
};
