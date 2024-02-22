const { StatusCodes } = require("http-status-codes");
const { ValidationErrors, AppErrors } = require("../errors");
const { Booking } = require("../models");

class BookingRepository {
  async create(data) {
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
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal Server Error",
        )
    }
  }

  async get() {}

  async getAll() {}

  async update(id , payload) {
    let criteria = {id: id};
    let returning  =["*"]
    const updatedFlight = await Booking.update(payload,{
      where:criteria,
      returning: returning
    })
    if(updatedFlight[1] === 1){
      const flight = await Booking.findByPk(id);
      return flight;
    }
    return;
  }

  async delete() {}
}
module.exports = BookingRepository;
