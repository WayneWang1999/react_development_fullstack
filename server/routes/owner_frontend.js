//This route is render a html to the views ejs .
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//Import the models
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Menu = require('../models/menu');
const Order = require('../models/order');
const Owner = require('../models/owner');
const Image = require('../models/image');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs'); // Add this line to use the File System module


/********************************************************************************************************* */
//login and main page



//user login check function

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the provided email exists
        const owner = await Owner.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!owner) {
            // Return error as JSON if no user with the given email
            return res.status(400).json({ error: 'Invalid email' });
        }

        // Fetch the order data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');

        // Send success response with the orders data
        return res.status(200).json({ message: 'Login successful', orders });

    } catch (err) {
        // console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.patch('/orders/:id/update', async (req, res) => {
    try {
        const { orderStatus } = req.body; // Get orderStatus from the request body
        console.log('Updating order with ID:', req.params.id, 'to status:', orderStatus);

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { orderStatus: orderStatus }, { new: true }).populate('customer');

        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }

        console.log('Updated order:', updatedOrder); // Log the updated order
        res.json(updatedOrder);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/menu', async (req, res) => {
    try {
        // Fetch nested references: owner -> restaurant_menus -> menu_images_url
        const menus = await Menu.find().populate({
            path: 'menu_images_url',
           
        });

        // Return the data in JSON format
        res.json({ menus });
    } catch (error) {
        console.error('Error fetching menu data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.patch('/menu/:id/edit', upload.single('menuImage'), async (req, res) => {
    try {
        const menuId = req.params.id;
        const updatedData = {
            name: req.body.name,
            sku: req.body.sku,
            description: req.body.description,
            price: req.body.price,
            inStock: req.body.inStock === 'true',
        };

        if (req.file) {
            const newImage = new Image({
                img: {
                    data: fs.readFileSync(req.file.path),
                    contentType: req.file.mimetype,
                },
                name: req.file.originalname,
            });

            const savedImage = await newImage.save();
            updatedData.menu_images_url = savedImage._id;
            fs.unlinkSync(req.file.path); // Remove the uploaded file from the server
        }

        const updatedMenu = await Menu.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        }).populate('menu_images_url');

        res.json({ success: true, updatedMenu });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;

