const { BookingService } = require("../services");

const bookingService = new BookingService();
const create = async (req, res) => {
  try {
    const response = await bookingService.createBooking(req.body);
    return res.status(201).json({
      message: "Successfully created a booking",
      success: true,
      err: {},
      data: response,
    });
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
      err: error.message,
      data: {},
    });
  }
};

module.exports = {
  create,
};
