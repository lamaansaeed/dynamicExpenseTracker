const cors = require('cors');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const User = require('./models/User');
const Expense = require('./models/TempExpense');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const sequelize = require('./database/database')

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Sync the model with the database (create table if not exists)
sequelize.sync({ alter: true })
    .then(() => {
        console.log('User table synced successfully');
    })
    .catch((error) => {
        console.error('Error syncing User table:', error);
    });
    Expense.sync({ alter: true })
    .then(() => {
        console.log('expense table synced successfully');
    })
    .catch((error) => {
        console.error('Error syncing User table:', error);
    });
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
const expenseRoutes = require('./routes/expense');
app.use('/', userRoutes); // All user-related routes
app.use('/', expenseRoutes); // Use the expense routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
