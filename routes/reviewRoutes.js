const express = require('express');
const router = express.Router();
const { 
    // createMovie,
    // getMovies,
    // deleteMovie,
    // getMovieByTitle,
    // updateMovie
    postReviews
 } = require('../controllers/reviewController');

// JWT Authentication Middleware import
const authJwtController = require('../middleware/auth_jwt');


// This route for only api/reviews
router.route('/')
    .post(authJwtController.isAuthenticated, postReviews);

module.exports = router; 