const express = require('express');
const router = express.Router();
const { 
    createMovie,
    getMovies,
    deleteMovie,
    getMovieByTitle,
    updateMovie
 } = require('../controllers/movieController');

// Mapping the routes to controller functions 

// JWT Authentication Middleware import
const authJwtController = require('../middleware/auth_jwt');


// This route for only api/movies
router.route('/')
    .get(authJwtController.isAuthenticated, getMovies)
    //.post(createMovie);  Added authentication to this admin function
    .post(authJwtController.isAuthenticated, createMovie); // Includes JwtController

// These are for only api/movies/:id
router.route('/:title')
    .get(authJwtController.isAuthenticated, getMovieByTitle)
    // .put(updateMovie)
    // .delete(deleteMovie); Added authentication to these functions
    .put(authJwtController.isAuthenticated, updateMovie)
    .delete(authJwtController.isAuthenticated,deleteMovie)
    .post(authJwtController.isAuthenticated, (req, res) => res.status(405).json({ message: 'FAIL' }));

module.exports = router; 

