const { StatusCodes } = require("http-status-codes");
const { FLIGHT_SERVICE_PATH, REMINDER_SERVICE_PATH } = require("../config/serverConfig");
const ServiceError = require("../errors/serviceErrors");
const { BookingRepository } = require("../repositories");
const axios = require("axios")
const schedule  = require("node-schedule")
class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }
  async createBooking(data) {
    try {
      const { flightId } = data;
      let getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const flight = await axios.get(getFlightUrl);
      const flightData = flight.data.data;
      let priceOfFlight = flightData.price;
      if (flightData.totalSeats < data.noOfSeats) {
        throw new ServiceError(
          "Something went wrong in Booking Process",
          "Seats Not Available",
          StatusCodes.CONFLICT
        );
      } else {
        const totalCost = priceOfFlight * data.noOfSeats;
        const bookingPayload = { ...data, totalCost };
        const booking = await this.bookingRepository.create(bookingPayload);
        const updateFlighRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
        await axios.patch(updateFlighRequestUrl, {totalSeats: flightData.totalSeats - booking.noOfSeats});
        const updatedBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
        const departureDate = new Date(flightData.departureTime)
        let reminderDate = departureDate - 48* 60 * 60* 1000;
        let onBoardingDate = departureDate - 24* 60 * 60* 1000;
        reminderDate = new Date(reminderDate);
        onBoardingDate = new Date(onBoardingDate)
        const reminderJob = schedule.scheduleJob(reminderDate , async() =>{
          const reminderFlightUrl = `${REMINDER_SERVICE_PATH}/api/v1/reminder-email`
          await axios.post(reminderFlightUrl,{from : "yasharora2678@gmail.com", to: "yash.1138@zenmonk.tech" , mailSubject:"Flight after 48 hours", mailBody:"You have a flight to onboard after 48 hours"} );
        })
        const onBoardingJob =  schedule.scheduleJob(onBoardingDate , async() =>{
         const reminderFlightUrl = `${REMINDER_SERVICE_PATH}/api/v1/reminder-email`
         await axios.post(reminderFlightUrl,{from : "yasharora2678@gmail.com", to: "yash.1138@zenmonk.tech" , mailSubject:"Flight after 48 hours", mailBody:"You have a flight to onboard after 48 hours"} );
       })
        return updatedBooking;
      }
    } catch (error) {
      console.log(error);
      if (
        error.name === "RepositoryError" ||
        error.name === "ValidationError"
      ) {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async updateBooking(bookingId) {
    try {
      const booking = await this.bookingRepository.get(bookingId);
      const { flightId } = booking;
      let getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const flight = await axios.get(getFlightUrl);
      const flightData = flight.data.data;
      const departureTime = new Date(flightData.departureTime);
      const currentTime = new Date();
      const timeDifference = departureTime.getTime() - currentTime.getTime();

      // Convert milliseconds to hours
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      // Check if the time difference is less than or equal to 24 hours
      if (hoursDifference <= 24) {
        throw new AppError(
          "CancelationError",
          "Cannot cancel booking Too Late Buddy!",
          StatusCodes.CONFLICT,
          "Flight departure is within 24 hours. Cannot update booking.",
        );
      }
      const updatedBooking = await this.bookingRepository.update(booking.id, {
        status: "Canceled",
      });
      const updateFlighRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      await axios.patch(updateFlighRequestUrl, {
        totalSeats: flightData.totalSeats + booking.noOfSeats,
      });
      return updatedBooking;
    } catch (error) {
      console.log(error);
      if (
        error.name === "RepositoryError" ||
        error.name === "ValidationError" ||
        error.name === "CancelationError"
      ) {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
