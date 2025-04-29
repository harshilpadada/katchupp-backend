const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // To allow CORS requests from your frontend
const dotenv = require('dotenv');  // To manage environment variables
dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());  // To allow cross-origin requests from frontend

// Connect to MongoDB using the URI in the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define the Slot schema
const slotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  circle: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
});

// Create a Mongoose model for the Slot
const Slot = mongoose.model('Slot', slotSchema);

// POST route to create a new slot
app.post('/slots', (req, res) => {
  const { time, circle, isPublic } = req.body;

  // Create a new slot instance
  const newSlot = new Slot({
    time,
    circle,
    isPublic,
  });

  // Save the new slot to the database
  newSlot.save()
    .then(slot => {
      res.status(201).json(slot);  // Return the created slot in the response
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error adding the slot" });  // Return an error if saving fails
    });
});

// GET route to fetch all slots
app.get('/slots', (req, res) => {
  Slot.find()
    .then(slots => {
      res.status(200).json(slots);  // Return all the slots in the response
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error fetching slots" });  // Return an error if fetching fails
    });
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
