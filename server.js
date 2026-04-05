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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => {
      console.error('❌ Could not connect to MongoDB. Error:', err);
  });

// Middleware
app.use(cors());
app.use(passport.initialize()); 
app.use(express.json()); // Removed bodyParser as I have learned its not required with new version of Express
app.use(express.urlencoded({ extended: false }));

// Mount Routes
app.use('/api/movies', movieRoutes); // Movie CRUD file
app.use('/api/auth', authRoutes); //  handles signup and sign
app.use('/api/reviews', reviewRoutes); // Handles review CRUD

// Code that starts server
const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only