const { StatusCodes } = require("http-status-codes");


class ValidationError extends Error {
    constructor(error){
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(err.message)
        });
        this.name = "ValidationError"
        this.message = 'Bad Request Check the Payload';
        this.explanation = explanation;
        this.statusCode = statusCode
    }
}

module.exports = ValidationError;