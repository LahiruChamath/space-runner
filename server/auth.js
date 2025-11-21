const jwt = require('jsonwebtoken');

function signSession(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function verifySession(token, secret) {
  return jwt.verify(token, secret);
}

function setCookie(res, token) {
  res.cookie('sid', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true in production with HTTPS
    path: '/'
  });
}

function clearCookie(res) {
  res.clearCookie('sid', { path: '/' });
}

function authRequired(req, res, next) {
  const token = req.cookies['sid'];
  if (!token) return res.status(401).send('No session');
  try {
    const payload = verifySession(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).send('Invalid session');
  }
}

module.exports = {
  signSession,
  verifySession,
  setCookie,
  clearCookie,
  authRequired
};
