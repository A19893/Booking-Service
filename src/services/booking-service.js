const { StatusCodes } = require("http-status-codes");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const ServiceError = require("../errors/serviceErrors");
const { BookingRepository } = require("../repositories");
const axios = require("axios")
class BookingService {
 constructor(){
    this.bookingRepository = new BookingRepository();
 }
 async createBooking(data){
    try{
     const {flightId} = data;
     let getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
     const flight = await axios.get(getFlightUrl)
     const flightData = flight.data.data;
     let priceOfFlight = flightData.price;
     if(flightData.totalSeats < data.noOfSeats){
        throw new ServiceError('Something went wrong in Booking Process', 'Seats Not Available', StatusCodes.CONFLICT)
     }
     else{
        const totalCost = priceOfFlight * data.noOfSeats;
        const bookingPayload ={...data , totalCost};
        const booking = await this.bookingRepository.create(bookingPayload);
        const updateFlighRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
        await axios.patch(updateFlighRequestUrl, {totalSeats: flightData.totalSeats - booking.noOfSeats});
        const updatedBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
        return updatedBooking;
     }
    }
    catch(error){
        console.log(error)
        if(error.name === 'RepositoryError' || error.name === 'ValidationError'){
           throw error;
        }
      throw new ServiceError();
    }
 }
}

module.exports = BookingService;