const { StatusCodes } = require("http-status-codes");
const { ValidationErrors, AppErrors } = require("../errors");
const { Booking } = require("../models");

class BookingRepository {
  async create() {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
        if(error.name === "SequelizeValidationError"){
            throw new ValidationErrors(error)
        }
        throw new AppErrors(
            "RepositoryError",
            "Cannot Create a Booking",
            "Internal Server Error",
            StatusCodes.INTERNAL_SERVER_ERROR
        )
    }
  }

  async get() {}

  async getAll() {}

  async update() {}

  async delete() {}
}
module.exports = BookingRepository;
