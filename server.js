const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://noufermohamed007:7L8Curlz2Y79LTja@law.utbohpo.mongodb.net/?retryWrites=true&w=majority&appName=law";

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const schema = new mongoose.Schema({
  section: Number,
  title: String,
  description: String,
  id: Number,
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
