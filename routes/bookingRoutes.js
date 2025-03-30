const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. Booking Room
router.post('/book-room', bookingController.bookRoom);

// 2. View Booking Details
router.get('/view-booking/:email', bookingController.viewBooking);

// 3. View All Guests
router.get('/all-guests', bookingController.viewAllGuests);

// 4. Cancel Room Booking
router.delete('/cancel-booking', bookingController.cancelBooking);

// 5. Modify Booking
router.put('/modify-booking', bookingController.modifyBooking);

module.exports = router;
