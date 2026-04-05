const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  releaseDate: { 
    type: Number, 
    min: [1900, 'Must be greater than 1899'], 
    max: [2100, 'Must be less than 2100'] 
  },
  genre: {
    type: String,
    enum: [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
    ],
  },
  actors: {
    type: [{
      actorName: String,
      characterName: String,
    }],
    validate: {
      validator: function(v) {
        return v && v.length >= 3;
      },
      message: "Movie must have at least 3 actors"
    }
  }
});

module.exports = mongoose.model('Movie', MovieSchema, 'Movies');