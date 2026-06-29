export function generateQuestion(tables) {
  if (!tables || tables.length === 0) {
    tables = [1];
  }

  const table = tables[Math.floor(Math.random() * tables.length)];
  const num = Math.floor(Math.random() * 10) + 1;

  const question = `${table} × ${num}`;
  const correct = table * num;

  const options = new Set();
  options.add(correct);

  while (options.size < 4) {
    const fake = correct + (Math.floor(Math.random() * 10) - 5);
    options.add(fake);
  }

  return {
    question,
    correct,
    options: shuffle([...options]),
  };
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}