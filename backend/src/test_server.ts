import express from 'express';

const app = express();
const PORT = 4001; // Use a different port to avoid conflicts

app.get('/', (req, res) => {
  res.send('Test Server is Alive!');
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on http://localhost:${PORT}`);
});
