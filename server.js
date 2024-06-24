const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = process.env.DB_LOCATION;

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const schema = new mongoose.Schema({
  section: String,
  title: String,
  description: String,
  id: Number,
}); 

app.get('/search', async (req, res) => {
  const { section, collectionName } = req.query; 

   console.log(section)
   const client = await mongoose.connection.getClient();
    const db = client.db("law");
    const collection = db.collection(`${collectionName}`);
    const result = await collection.findOne({ section: section  });

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Section not found' });
  }
});

app.get('/fetch/:collectionName', async (req, res) => {
  try {
    const { collectionName } = req.params;
    const client = await mongoose.connection.getClient();
    const db = client.db("law");
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    res.json(result);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
