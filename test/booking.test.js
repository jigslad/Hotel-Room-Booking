const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Booking = require('../models/Booking');

describe('Hotel Room Booking System API Tests', function() {
    // Before each test, clear the Booking collection to ensure a clean slate
    beforeEach(async function() {
        await Booking.deleteMany({});
    });

    // 1. Test Case: Booking Room API
    describe('POST /api/book-room', function() {
        it('should successfully book a room', async function() {
            const bookingData = {
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            };

            const response = await request(app)
                .post('/api/book-room')
                .send(bookingData)
                .expect(201);

            // Check if the room number is assigned and booking was successful
            const booking = await Booking.findOne({ email: 'johndoe@example.com' });

            expect(booking).to.not.be.null;
            expect(booking.guestName).to.equal('John Doe');
            expect(booking.roomNumber).to.be.a('number');
            expect(booking.status).to.equal('booked');
        });

        it('should return an error if no rooms are available', async function() {
            // Make sure to mock the scenario when no rooms are available (optional based on your test setup)
            await Booking.create({
                guestName: 'Jane Doe',
                contactDetails: '098-765-4321',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'janedoe@example.com',
                roomNumber: 101
            });

            const bookingData = {
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            };

            const response = await request(app)
                .post('/api/book-room')
                .send(bookingData)
                .expect(400);

            expect(response.body.message).to.equal('No rooms available');
        });
    });

    // 2. Test Case: View Booking Details API
    describe('GET /api/view-booking/:email', function() {
        it('should retrieve booking details by email', async function() {
            // Create a booking first
            const bookingData = {
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            };
            const booking = await request(app).post('/api/book-room').send(bookingData);

            const response = await request(app)
                .get('/api/view-booking/johndoe@example.com')
                .expect(200);

            expect(response.body.email).to.equal('johndoe@example.com');
            expect(response.body.guestName).to.equal('John Doe');
        });

        it('should return an error if the booking does not exist', async function() {
            const response = await request(app)
                .get('/api/view-booking/nonexistent@example.com')
                .expect(404);

            expect(response.body.message).to.equal('No booking found for this email');
        });
    });

    // 3. Test Case: View All Guests in the Hotel API
    describe('GET /api/all-guests', function() {
        it('should return a list of all booked guests', async function() {
            // Create bookings
            await request(app).post('/api/book-room').send({
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            });

            await request(app).post('/api/book-room').send({
                guestName: 'Jane Doe',
                contactDetails: '987-654-3210',
                checkInDate: '2025-04-02T14:00:00.000Z',
                checkOutDate: '2025-04-12T11:00:00.000Z',
                email: 'janedoe@example.com'
            });

            const response = await request(app)
                .get('/api/all-guests')
                .expect(200);

            expect(response.body).to.be.an('array');
            expect(response.body.length).to.equal(2);
            expect(response.body[0].guestName).to.equal('John Doe');
            expect(response.body[1].guestName).to.equal('Jane Doe');
        });
    });

    // 4. Test Case: Cancel Room Booking API
    describe('DELETE /api/cancel-booking', function() {
        it('should cancel a booking successfully', async function() {
            // Create a booking
            const bookingData = {
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            };
            const booking = await request(app).post('/api/book-room').send(bookingData);

            const response = await request(app)
                .delete('/api/cancel-booking')
                .send({
                    email: 'johndoe@example.com',
                    roomNumber: booking.body.bookingDetails.roomNumber
                })
                .expect(200);

            expect(response.body.message).to.equal('Booking cancelled successfully');
        });

        it('should return an error if the booking is not found', async function() {
            const response = await request(app)
                .delete('/api/cancel-booking')
                .send({
                    email: 'johndoe@example.com',
                    roomNumber: 101
                })
                .expect(404);

            expect(response.body.message).to.equal('Booking not found');
        });
    });

    // 5. Test Case: Modify Booking API
    describe('PUT /api/modify-booking', function() {
        it('should modify booking details successfully', async function() {
            // Create a booking
            const bookingData = {
                guestName: 'John Doe',
                contactDetails: '123-456-7890',
                checkInDate: '2025-04-01T14:00:00.000Z',
                checkOutDate: '2025-04-10T11:00:00.000Z',
                email: 'johndoe@example.com'
            };
            const booking = await request(app).post('/api/book-room').send(bookingData);

            const response = await request(app)
                .put('/api/modify-booking')
                .send({
                    email: 'johndoe@example.com',
                    roomNumber: booking.body.bookingDetails.roomNumber,
                    newCheckInDate: '2025-04-02T14:00:00.000Z',
                    newCheckOutDate: '2025-04-12T11:00:00.000Z'
                })
                .expect(200);

            expect(response.body.message).to.equal('Booking modified successfully');
            expect(response.body.booking.checkInDate).to.equal('2025-04-02T14:00:00.000Z');
            expect(response.body.booking.checkOutDate).to.equal('2025-04-12T11:00:00.000Z');
        });

        it('should return an error if the booking does not exist', async function() {
            const response = await request(app)
                .put('/api/modify-booking')
                .send({
                    email: 'nonexistent@example.com',
                    roomNumber: 101,
                    newCheckInDate: '2025-04-02T14:00:00.000Z',
                    newCheckOutDate: '2025-04-12T11:00:00.000Z'
                })
                .expect(404);

            expect(response.body.message).to.equal('Booking not found');
        });
    });

    // After all tests, disconnect from MongoDB
    after(async function() {
        await mongoose.connection.close();
    });
});
