const crypto = require('crypto');

const store = new Map();

async function newPuzzle() {
  const url = 'https://marcconrad.com/uob/banana/api.php?out=json';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Banana API error ' + res.status);
  }
  const data = await res.json();
  const questionUrl = data.question;
  const solution = Number(data.solution);

  const token = crypto.randomBytes(16).toString('hex');
  store.set(token, solution);

  return { imageUrl: questionUrl, token };
}
function checkAnswer(token, answer) {
  if (!store.has(token)) return false;
  const correct = store.get(token);
  store.delete(token);
  const num = Number(answer);
  if (!Number.isFinite(num)) return false;
  return num === correct;
}

module.exports = { newPuzzle, checkAnswer };
