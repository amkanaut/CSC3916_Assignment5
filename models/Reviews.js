const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  username: String,
  review: String,
  rating: { type: Number, min: 0, max: 5 }
});

module.exports = mongoose.model('Reviews', reviewSchema, 'Reviews');