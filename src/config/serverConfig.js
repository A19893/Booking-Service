require("dotenv").config();


module.exports = {
    APP_PORT : process.env.APP_PORT,
    FLIGHT_SERVICE_PATH : process.env.FLIGHT_SERVICE_PATH,
    REMINDER_SERVICE_PATH : process.env.REMINDER_SERVICE_PATH
}

