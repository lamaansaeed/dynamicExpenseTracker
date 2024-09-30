const cors = require('cors');
const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const http = require('http');
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
console.log(process.env.SERVER_PORT);
const PORT = process.env.SERVER_PORT ||443; // Use 443 for HTTPS

// Load SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://51.20.8.72:3000'], // Allow connections to your server 
      scriptSrc: ["'self'", "https://checkout.razorpay.com","https://checkout.razorpay.com/v1/checkout.js"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"], // Allow Razorpay iframes
      imgSrc: ["'self'", "https://*.razorpay.com"], // Optionally allow Razorpay images
      styleSrc: ["'self'", "'unsafe-inline'"] // Allow inline styles (if needed)
    }
  }
}));
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

httpsServer.listen(PORT,'0.0.0.0', () => {
    console.log(`Secure server is running on https://localhost:${PORT}`);
});

