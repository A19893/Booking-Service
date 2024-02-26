const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

const sendMessageToQueue = async (req, res) => {
  const channel = await createChannel();
  const payload = { data:{
    subject: 'This is a Notice from queue',
    content: 'Some queue will subscribe it',
    recepientEmail: "yasharora2678@gmail.com",
    notificationTime: '2024-02-26T12:30:00'
  }, service: "CREATE_TICKET" };
  publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
  return res.status(200).json("Published Message Successfully");
};

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
    console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
      err: error.message,
      data: {},
    });
  }
};

const update = async (req, res) => {
  try {
    const response = await bookingService.updateBooking(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Successfully cancelled your booking",
      success: true,
      err: {},
      data: response,
    });
  } catch (error) {
    console.log(error);
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
  update,
  sendMessageToQueue,
};
