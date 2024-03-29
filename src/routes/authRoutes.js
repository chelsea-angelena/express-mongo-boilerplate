require('dotenv').config();
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

module.exports = (router) => {
	router.post('/signup', async (req, res) => {
		const { email, password } = req.body;
		try {
			const user = new User({ email, password });
			await user.save();
			const token = jwt.sign({ userId: user._id }, 'JWT_SECRET_KEY');
			console.log(token);
			res.send({ token });
		} catch (err) {
			return res.status(422).send(err.message);
		}
	});

	router.post('/signin', async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(422).send({ Error: 'Must provide email and password' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(422).send({ error: 'Invalid email ' });
		}
		try {
			const pass = await user.comparePassword(password);
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
			res.send({ token });
		} catch (err) {
			return res.status(422).send({ error: 'Invalid email or password' });
		}
	});
};
