require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose'); 



// Imports

const reviewRoutes = require('./routes/reviewRoutes');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes') 
const User = require('./models/Users');
const Movie = require('./models/Movies'); // You're not using Movie, consider removing it


const app = express();

connectDB();

console.log("My Mongo URI is:", process.env.MONGO_URI);

// Middleware
app.use(cors({
    origin: '*', // Adjust this to your React app's URL for better security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(passport.initialize()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount Routes
const { signup, signin } = require('./controllers/authController');
app.post('/signup', signup);
app.post('/signin', signin);

app.use('/api/movies', movieRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/reviews', reviewRoutes);

// Code that starts server
const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only