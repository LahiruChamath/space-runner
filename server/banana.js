const crypto = require('crypto');

// simple in-memory store: token -> solution
const store = new Map();

/**
 * Fetch a new Banana puzzle from Marc Conrad's API
 * Returns: { imageUrl, token }
 */
async function newPuzzle() {
  // Node 18+ has global fetch (you are on Node 24.x)
  const url = 'https://marcconrad.com/uob/banana/api.php?out=json';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Banana API error ' + res.status);
  }
  const data = await res.json();
  // docs: { question: "image-url", solution: number }
  const questionUrl = data.question;
  const solution = Number(data.solution);

  const token = crypto.randomBytes(16).toString('hex');
  store.set(token, solution);

  return { imageUrl: questionUrl, token };
}

/**
 * Check user's answer against stored solution.
 * Once validated, the token is removed from memory.
 */
function checkAnswer(token, answer) {
  if (!store.has(token)) return false;
  const correct = store.get(token);
  store.delete(token);
  const num = Number(answer);
  if (!Number.isFinite(num)) return false;
  return num === correct;
}

module.exports = { newPuzzle, checkAnswer };
