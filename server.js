const cors = require('cors');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const User = require('./models/users');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Sync the model with the database (create table if not exists)
User.sync({ alter: true })
    .then(() => {
        console.log('User table synced successfully');
    })
    .catch((error) => {
        console.error('Error syncing User table:', error);
    });

// Serve login.html as the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Import Routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes); // All user-related routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
