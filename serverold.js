// import dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/connection'); // Import the Sequelize connection
const { User, Playlist } = require('./models'); // Import your models
const authController = require('./controllers/authController'); // Import your auth controller

const app = express();
const PORT = process.env.PORT || 4000;

// Serve express and json data functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve the session
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/')));

// Use the authController for handling authentication routes
app.use('/auth', authController);

// Serve the yourspace home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/yourspace', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Define the register route to serve the register form
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});

// Define the login route to serve the login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve the music page
app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'music.html'));
});

// Query the playlist table
app.get('/get-playlist', async (req, res) => {
  try {
    const playlists = await Playlist.findAll();
    console.log('Playlist data retrieved successfully:', playlists);
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
