require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { newPuzzle, checkAnswer } = require('./banana');
const { signSession, authRequired, setCookie, clearCookie, verifySession } = require('./auth');
const User = require('./models/User');
const Run = require('./models/Run');

const app = express();
const PORT = process.env.PORT || 8081;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// --- DB connect ---
(async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'space_runner';
  if (!uri) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName });
  console.log('✅ MongoDB connected:', dbName);
})().catch(err => {
  console.error('Mongo connection error:', err);
  process.exit(1);
});

// --- middlewares ---
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- Auth ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).send('Missing fields');

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).send('Email exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    const token = signSession(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );
    setCookie(res, token);
    res.json({ _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt });
  } catch (e) {
    console.error('Register failed', e);
    res.status(500).send('Register failed');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).send('Invalid credentials');

    const token = signSession(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );
    setCookie(res, token);
    res.json({ _id: user._id, username: user.username, email: user.email });
  } catch (e) {
    console.error('Login failed', e);
    res.status(500).send('Login failed');
  }
});

app.post('/api/auth/logout', (req, res) => {
  clearCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies['sid'];
  if (!token) return res.status(401).send('No session');
  try {
    const payload = verifySession(token, process.env.JWT_SECRET);
    if (!payload) throw new Error('Invalid');
    res.json(payload);
  } catch {
    res.status(401).send('Invalid session');
  }
});

// --- Banana ---
app.get('/api/banana/new', async (req, res) => {
  try {
    const puzzle = await newPuzzle();
    res.json(puzzle); // { imageUrl, token }
  } catch (e) {
    console.error('Banana new error', e);
    res.status(502).send('Banana API unavailable');
  }
});

app.post('/api/banana/answer', (req, res) => {
  const { token, answer } = req.body;
  const correct = checkAnswer(token, answer);
  res.json({ correct });
});

// --- Scores / runs ---
function computeMixedScore(run) {
  const timeSec = run.durationMs / 1000;
  return Math.floor(
    timeSec * 5 +
    (run.dodges || 0) * 10 +
    (run.correctAnswers || 0) * 50 -
    (run.wrongAnswers || 0) * 25
  );
}

app.post('/api/scores/submit', authRequired, async (req, res) => {
  const { durationMs, dodges = 0, correctAnswers = 0, wrongAnswers = 0 } = req.body;
  if (typeof durationMs !== 'number') return res.status(400).send('durationMs required');
  try {
    const run = new Run({
      userId: req.user._id,
      username: req.user.username,
      durationMs,
      dodges,
      correctAnswers,
      wrongAnswers
    });
    run.scoreMixed = computeMixedScore(run);
    await run.save();
    res.json({ ok: true, run });
  } catch (e) {
    console.error('Score submit error', e);
    res.status(500).send('Submit failed');
  }
});

// raw top runs (not strictly needed but kept)
app.get('/api/scores/top', async (req, res) => {
  const type = (req.query.type || 'mixed').toLowerCase();
  const sort =
    type === 'time'
      ? { durationMs: -1, createdAt: 1 }
      : { scoreMixed: -1, createdAt: 1 };
  const rows = await Run.find({}).sort(sort).limit(50).lean();
  res.json(rows);
});

// per-user best (used by leaderboard page)
app.get('/api/scores/top-best', async (req, res) => {
  const rows = await Run.aggregate([
    {
      $group: {
        _id: '$userId',
        username: { $first: '$username' },
        bestScore: { $max: '$scoreMixed' },
        bestTime: { $max: '$durationMs' },
        lastRunAt: { $max: '$createdAt' }
      }
    },
    { $sort: { bestScore: -1, bestTime: -1, username: 1 } },
    { $limit: 50 }
  ]);
  res.json(rows);
});

// ---
app.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));
