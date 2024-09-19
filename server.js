const cors = require('cors');
const path = require('path');
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const Income = require('./models/Income');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./database/database');
const helmet = require('helmet');

const PORT = process.env.SERVER_PORT || 443; // Use 443 for HTTPS

// Load SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const models = { User, Expense, Order, Income };
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const razorpayRoutes = require('./routes/razorpay');
const forgotpassRoutes = require('./routes/forgotPass');
const incomeRoutes = require('./routes/income');
const reportRoutes = require('./routes/report');
app.use('/', userRoutes);
app.use('/', expenseRoutes);
app.use('/', incomeRoutes);
app.use('/', razorpayRoutes);
app.use('/', forgotpassRoutes);
app.use('/', reportRoutes);

app.get('/api/config', (req, res) => {
    res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID });
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Secure server is running on https://localhost:${PORT}`);
});

// Optional: HTTP server to redirect traffic to HTTPS
const httpApp = express();
httpApp.get('*', (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});
http.createServer(httpApp).listen(80, () => {
    console.log('HTTP server is running on http://localhost:80');
});
