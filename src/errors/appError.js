

class AppError extends Error {
    constructor(name, message, statusCode, explanation){
    this.name=name;
    this.message =  message;
    this.statusCode = statusCode;
    this.explanation = explanation;
    }
}

module.exports = AppError