// handles logging the admin in and giving them back a token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are both required' });
  }

  try {
    const foundUser = await User.findOne({ where: { username: username } });

    if (!foundUser) {
      // keep the message vague on purpose so we don't tell attackers which part was wrong
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const token = jwt.sign(
      { userId: foundUser.id, username: foundUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.json({
      token: token,
      username: foundUser.username
    });
  } catch (err) {
    console.log('login error:', err);
    res.status(500).json({ message: 'Something went wrong while logging in' });
  }
}

module.exports = { login };
