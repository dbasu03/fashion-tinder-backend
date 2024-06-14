const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Replace 'your-password' with the password you set during database creation
const driver = neo4j.driver(
  'bolt://localhost:7687',  // Ensure this matches your Neo4j instance URL
  neo4j.auth.basic('neo4j', 'password')  // Replace 'your-password' with your actual password
);

const session = driver.session();

app.get('/', (req, res) => {
  res.send('Fashion Tinder API');
});

// API to get fashion items
app.get('/api/fashion-items', async (req, res) => {
  try {
    const result = await session.run('MATCH (item:FashionItem) RETURN item');
    const items = result.records.map(record => record.get('item').properties);
    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to like a fashion item
app.post('/api/like', async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    await session.run(
      'MATCH (u:User {id: $userId}), (i:FashionItem {id: $itemId}) MERGE (u)-[:LIKES]->(i)',
      { userId, itemId }
    );
    res.status(200).send('Liked');
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to dislike a fashion item
app.post('/api/dislike', async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    await session.run(
      'MATCH (u:User {id: $userId}), (i:FashionItem {id: $itemId}) MERGE (u)-[:DISLIKES]->(i)',
      { userId, itemId }
    );
    res.status(200).send('Disliked');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
