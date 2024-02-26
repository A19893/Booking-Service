require("dotenv").config();


module.exports = {
    APP_PORT : process.env.APP_PORT,
    FLIGHT_SERVICE_PATH : process.env.FLIGHT_SERVICE_PATH,
    REMINDER_SERVICE_PATH : process.env.REMINDER_SERVICE_PATH,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY : process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL
}

