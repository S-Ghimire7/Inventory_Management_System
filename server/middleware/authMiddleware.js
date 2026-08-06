// this middleware checks that a valid admin token was sent before letting
// the request continue to the actual route logic
const jwt = require('jsonwebtoken');

function requireLogin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You must be logged in to do that' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session is invalid or has expired, please log in again' });
  }
}

module.exports = requireLogin;
