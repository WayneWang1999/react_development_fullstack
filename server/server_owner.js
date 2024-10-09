//This is the owner website designed by Wayne:
const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// Import models
const Customer = require('./models/customer');
const Driver = require('./models/driver');
const Menu = require('./models/menu');
const Order = require('./models/order');
const owner = require('./models/owner');
const Image=require('./models/image')
//define the server
const app = express();


app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// setup sessions for login
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../client/build')));
//************************************************************************************************************************** */
//mount the router only need to edit this code
const ownerRouters = require('./routes/owner_frontend');
app.use('/owner', ownerRouters);

//******************************************************************************************************************

// Fallback route to serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
 });
 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


//for the form submit
app.use(express.urlencoded({ limit: '10mb',extended: true }));

/********* */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});