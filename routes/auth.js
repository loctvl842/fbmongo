const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user into database and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error();
      error.message =
        "The email address or mobile number you entered isn't connected to an account.";
      error.name = 'email';
      throw error;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      const error = new Error();
      error.message = "The password that you've entered is incorrect.";
      error.name = 'password';
      throw error;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.message) {
      res.status(400).json({ type: error.name, content: error.message });
    } else {
      res.status(500).json(error);
    }
  }
});

module.exports = router;
