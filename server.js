const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Handle signup route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    console.log('Received Payload:', req.body);

    // For demonstration purposes, we'll just send a success message back
    res.json({ message: 'Signup successful!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
