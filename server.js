const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;



app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  
});

const querySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  title: String,
  description: String,
  availableTime: String,
});

const Query = mongoose.model('Query', querySchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('server connected');
});


app.post('/api/queries', async (req, res) => {
  const { userId, category, title, description, availableTime } = req.body;

  const newQuery = new Query({ userId, category, title, description, availableTime });

  try {
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/queries', async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 3);

  const newUser = new User({ name, email, password: hashedPassword });


  try {

    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the password is correct
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: 'Login successful!', user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
