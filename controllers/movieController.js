const Movie = require('../models/Movies'); 

// @desc Takes request, interacts with Model/Movies, and sends a response
// @route POST /api/movies



// [x]@desc get all movies updated to aggregate reviews and movies collection
// @route GET /api/movies

const getMovies = async (req, res) => {

    // const pipeline = [
    //     {
    //         $match: {
    //             title: "Interstellar"
    //         }
    //     }
    // ];
    // const cursor = collection.aggregate(pipeline);
    // return cursor;
    try {
        // [x] Check if the user specifically asked for reviews in the URL query
        if (req.query.reviews === 'true') {
            
            // 2. Use the aggregation pipeline to "Join" the collections
            const moviesWithReviews = await Movie.aggregate([
                {
                    $lookup: {
                        from: "Reviews",         // Exact name of review collection in MongoDB
                        localField: "_id",       // The ID of the movie 
                        foreignField: "movieId", // The field in the Review document that points back to the movie
                        as: "reviews"            // What to name the newly attached array in the JSON response
                    }
                }
            ]);
            
            return res.status(200).json(moviesWithReviews);
            
        } else {
            // 3. If ?reviews=true is missing or false, just return movie
            const movies = await Movie.find();
            return res.status(200).json(movies);
        }
        
    } catch (error) {
        return res.status(500).json({ 
            message: 'Failed to fetch movies', 
            details: error.message 
        });
    }
};


// [x] @desc create a movie(Same as saving, but it first creates it and then saves it)
// @route POST /api/movies
const createMovie = async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ 
            message: 'Failed to create movie due to invalid data', 
            details: error.message 
        });
    }
};


 // [x] @desc Return a specific movie based on the :movieparameter(movie.id) updated to include reviews
 // route GET api/movies/:id

const getMovieByTitle = async (req, res) => {
    try {
        // [x] Check if the user asked for reviews
        if (req.query.reviews === 'true') {
            
            const movieData = await Movie.aggregate([
                {
                    // [x]: Find the specific movie first
                    $match: { title: req.params.title } 
                },
                {
                    // [x]: Grab the reviews for that movie
                    $lookup: {
                        from: "Reviews",         // Exact name of review collection in mongoDB
                        localField: "_id",       // The ID of this movie
                        foreignField: "movieId", // The field in the review pointing to this movie
                        as: "reviews"            // Name of the appended array
                    }
                }
            ]);

            // aggregate() always returns an array. If it's empty, the movie wasn't found.
            if (movieData.length === 0) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Return the first (and only) movie object from the array
            return res.status(200).json(movieData[0]);

        } else {
            
            //  Standard lookup without reviews
            const movie = await Movie.findOne({ title: req.params.title });

            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' }); 
            }

            return res.status(200).json(movie);
        }

    } catch (error) {
        return res.status(500).json({ message: 'Server error', details: error.message });
    }
};

// [] @desc update a movie
// @route PUT /api/movies/:id

const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findOneAndUpdate(
            { title: req.params.title }, // 1. The filter
            req.body,                    // 2. The update data
            { new: true, runValidators: true } // 3. Options
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};


// [] @desc delete a movie
// @route DELETE /api/movies/:id

const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findOneAndDelete({ title: req.params.title });

        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie successfully deleted', title: req.params.title });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};


module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieByTitle
};