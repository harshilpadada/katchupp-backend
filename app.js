
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const Slot = mongoose.model('Slot', new mongoose.Schema({
  userId: String,
  time: String,
  circle: String,
  isPublic: Boolean
}));

app.post('/api/slots', async (req, res) => {
  const slot = new Slot(req.body);
  await slot.save();
  res.send(slot);
});

app.get('/api/slots', async (req, res) => {
  const slots = await Slot.find();
  res.send(slots);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
