const Booking = require('../models/Booking');

// 1. Booking Room
exports.bookRoom = async (req, res) => {
    const { guestName, contactDetails, checkInDate, checkOutDate, email } = req.body;

    const existingBookings = await Booking.find({ status: 'booked' });
    const allRooms = [101, 102, 103, 104, 105];  // Predefined room numbers
    const bookedRooms = existingBookings.map(booking => booking.roomNumber);
    const availableRooms = allRooms.filter(room => !bookedRooms.includes(room));

    if (availableRooms.length === 0) {
        return res.status(400).json({ message: 'No rooms available' });
    }

    const roomNumber = availableRooms[0]; // Assign the first available room

    const newBooking = new Booking({
        guestName,
        contactDetails,
        checkInDate,
        checkOutDate,
        email,
        roomNumber
    });

    try {
        await newBooking.save();
        res.status(201).json({
            message: 'Room booked successfully',
            bookingDetails: newBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Error booking the room', error });
    }
};

// 2. View Booking Details
exports.viewBooking = async (req, res) => {
    const { email } = req.params;
    try {
        const booking = await Booking.findOne({ email, status: 'booked' });
        if (!booking) {
            return res.status(404).json({ message: 'No booking found for this email' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error });
    }
};

// 3. View All Guests
exports.viewAllGuests = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'booked' });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guest list', error });
    }
};

// 4. Cancel Room Booking
exports.cancelBooking = async (req, res) => {
    const { email, roomNumber } = req.body;

    try {
        const booking = await Booking.findOneAndUpdate(
            { email, roomNumber, status: 'booked' },
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
};

// 5. Modify Booking
exports.modifyBooking = async (req, res) => {
    const { email, roomNumber, newCheckInDate, newCheckOutDate } = req.body;

    try {
        const booking = await Booking.findOne({ email, roomNumber, status: 'booked' });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.checkInDate = newCheckInDate || booking.checkInDate;
        booking.checkOutDate = newCheckOutDate || booking.checkOutDate;

        await booking.save();

        res.json({ message: 'Booking modified successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error modifying booking', error });
    }
};
