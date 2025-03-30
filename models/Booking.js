const mongoose = require('mongoose');

// Booking schema definition
const bookingSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    contactDetails: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    roomNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
