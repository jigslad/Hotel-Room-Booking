const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(bodyParser.json());

app.use('/api', bookingRoutes);

module.exports = app;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hotel-booking', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', bookingRoutes);

// If you're running the app (i.e., starting the server), you can do it here
// This will not interfere with the tests because `app.listen()` will only run when the app is started normally
if (require.main === module) {
    const PORT = 5000;
    mongoose.connect('mongodb://localhost:27017/hotel-booking', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Database connection failed:', err);
        });
}
