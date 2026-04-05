const axios = require('axios');

const GA_ID = process.env.GA_MEASUREMENT_ID;
const GA_SECRET = process.env.GA_API_SECRET;

const trackMovieEvent = async (movie, action, label) => {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

    const eventData = {
        client_id: 'server_side_client',
        events: [{
            name: 'movie_query_event', 
            params: {
                movie_name: movie.title,
                requested: 1,


                event_category: movie.genre,
                event_action: action,
                event_label: label,
                value: 1          
            }
        }]
    };

    try {
        await axios.post(url, payload);
        console.log(`GA4: Tracked ${action} for ${movie.title}`);
    } catch (err) {
        console.error("GA4 Tracking Failed:", err.message);
    }
};

module.exports = trackMovieEvent;