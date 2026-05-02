let envPath = __dirname + "/../.env";
require('dotenv').config({ path: envPath });
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../models/Users');
let Movie = require('../models/Movies');
let Review = require('../models/Reviews');
chai.should();

chai.use(chaiHttp);

const testData = {
    user: {
        name: 'Review Tester',
        username: 'reviewtester@test.com',
        password: 'password123'
    },
    movie: {
        title: 'Review Test Movie',
        releaseDate: 2024,
        genre: 'Action',
        actors: [
            { actorName: 'Actor 1', characterName: 'Char 1' },
            { actorName: 'Actor 2', characterName: 'Char 2' },
            { actorName: 'Actor 3', characterName: 'Char 3' }
        ]
    }
};

let token = '';
let movieId = '';

describe('Test Review Routes', () => {
    before(async () => {
        try {
            await User.deleteOne({ username: testData.user.username });
            await Movie.deleteOne({ title: testData.movie.title });
            // Clean up reviews for the movie if any exist (though title is unique-ish for test)
        } catch (error) {
            console.error("Error in setup:", error);
        }
    });

    it('should register and login user', async () => {
        await chai.request(server)
            .post('/api/auth/signup')
            .send(testData.user);
        
        const res = await chai.request(server)
            .post('/api/auth/signin')
            .send(testData.user);
            
        res.should.have.status(200);
        res.body.should.have.property('token');
        token = res.body.token;
    });

    it('should create a movie', async () => {
        const res = await chai.request(server)
            .post('/api/movies')
            .set('Authorization', token)
            .send(testData.movie);
            
        res.should.have.status(201);
        movieId = res.body._id;
    });

    it('should post a review for the movie', async () => {
        const res = await chai.request(server)
            .post('/api/reviews')
            .set('Authorization', token)
            .send({
                movieId: movieId,
                review: 'Great movie!',
                rating: 5
            });
            
        res.should.have.status(201);
        res.body.should.have.property('message', 'Review created!');
    });

    it('should retrieve movie with reviews', async () => {
        const res = await chai.request(server)
            .get(`/api/movies/${testData.movie.title}?reviews=true`)
            .set('Authorization', token);
            
        res.should.have.status(200);
        res.body.should.have.property('reviews');
        res.body.reviews.should.be.an('array');
        res.body.reviews.should.have.lengthOf(1);
        res.body.reviews[0].should.have.property('review', 'Great movie!');
        res.body.reviews[0].should.have.property('username', testData.user.username);
    });

    after(async () => {
        try {
            await User.deleteOne({ username: testData.user.username });
            if (movieId) {
                await Review.deleteMany({ movieId: movieId });
                await Movie.deleteOne({ _id: movieId });
            }
        } catch (error) {
            console.error("Error in cleanup:", error);
        }
    });
});