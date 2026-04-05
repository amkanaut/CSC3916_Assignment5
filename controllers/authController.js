// Imports
const User = require('../models/Users');
const jwt = require('jsonwebtoken');




// @Desc handles user sign up
// @Route POST api/auth/signup
const signup = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' });
    }

    try {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        });

        await user.save();

        res.status(201).json({ success: true, msg: 'Successfully created new user.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: 'A user with that username already exists.' });
        } else {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
    }
};


// @Desc handles user sign in
// @Route POST api/auth/signin

const signin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
        }

        const isMatch = await user.comparePassword(req.body.password);

        if (isMatch) {
            const userToken = { id: user._id, username: user.username };
            const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.json({ success: true, token: 'JWT ' + token });
        } else {
            res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
};

module.exports = {
    signup,
    signin
};