const express = require("express");
const { BookingController } = require("../../controllers");

const router = express.Router();

router.get('/', (req,res)=>{
    res.send("This is a Booking System MicroService 1.0.0")
})

router.post('/booking', BookingController.create);

module.exports = router; 