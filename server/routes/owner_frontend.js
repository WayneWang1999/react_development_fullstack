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


// Fallback route to serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
 });
 

/********************************************************************************************************* */
//login and main page
router.get('/', async (req, res) => {

    if (req.session.hasOwnProperty("loggedInUser") === true) {
        // If login is successful, fetch the data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');

        // Render the owner's dashboard or a layout with fetched data
        return res.render('owners/layout', { orders });

    }
    return res.render('owners/login');
});

router.get('/logout', async (req, res) => {

    req.session.destroy()
    console.log("LOGGED OUT!!! Redirecting you back to the / endpoint")
    return res.redirect("/owner")

});

//user login check function

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        // Check if a user with the provided email exists
        const owner = await Owner.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!owner) {
            // Return error if no user with the given email
            return res.status(400).render('owners/login', { error: 'Invalid email' });
        }
        const isMatch = await bcrypt.compare(password, owner.password);
        // Compare the provided password with the stored hashed password
        if (!isMatch) {  // Fixed from user.password to owner.password
            return res.status(400).render('owners/login', { error: 'Invalid email or password' });
        }
        //If login is successful,add userSession keep the login untill logout .
        const userSession = { email, password };
        req.session.loggedInUser = userSession;

        //  fetch the order data
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');


        // Render the owner's dashboard to a layout with fetched data
        return res.render('owners/layout', { orders });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/orders/:id/view', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('driver').populate('order_Menus.menu');

    res.render('owners/order_view.ejs', { order });
});

//This is for debug function. In the sumbit project don't use this point.
router.get('/orders/:id/edit', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('driver');

    res.render('owners/order_edit.ejs', { order });
});

router.post('/orders/:id/update', async (req, res) => {
    try {
        const { orderStatus } = req.body; // Get orderStatus from the form
        // Update the order's status in the database
        await Order.findByIdAndUpdate(req.params.id, { orderStatus: orderStatus });
        const orders = await Order.find().populate('customer').populate('driver').populate('order_Menus.menu');
         // Render the owner's dashboard or a layout with fetched data
        res.render('owners/layout', { orders });

    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/menu', async (req, res) => {
    //nested reference owner->restaurant_menus->menu_image
    const owners = await Owner.find().populate({
        path: 'restaurant_menus',
        populate: { path: 'menu_images_url' }
    });;
    res.render('owners/owner_view', { owners });
});
router.get('/info/edit', async (req, res) => {
    const owners = await Owner.find().populate('restaurant_menus');
    res.render('owners/owner_edit', { owners });
});

router.post('/info/update', async (req, res) => {
    const { 
        ownerId, 
        firstName, 
        lastName, 
        email, 
        password, 
        restaurant_name, 
        restaurant_address_street, 
        restaurant_address_city 
    } = req.body;

    // Prepare the update object
    const updatedData = {
        firstName,
        lastName,
        email,
        restaurant_name
    };

    // Update address fields only if provided
    if (restaurant_address_street) {
        updatedData['restaurant_address.street'] = restaurant_address_street;
    }

    if (restaurant_address_city) {
        updatedData['restaurant_address.city'] = restaurant_address_city;
    }

    // Only hash and update the password if provided
    if (password && password.trim() !== "") {
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updatedData.password = hashedPassword; // Only set if new password provided
    }

    try {
        // Update the owner in the database
        await Owner.findByIdAndUpdate(ownerId, { $set: updatedData });

        res.redirect('/owner/menu');
    } catch (err) {
        console.error('Error updating owner:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/menu/:id/edit', async (req, res) => {
    try {

        const menu = await Menu.findById(req.params.id).populate('menu_images_url');
        if (!menu) {
            return res.status(404).send('Menu not found');
        }
        res.render('owners/menu_edit', { menu }); // Change 'menus' to 'menu'
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/menu/update', upload.single('menuImage'), async (req, res) => {
    try {
        const menuId = req.body.menuId;
        const updatedData = {
            name: req.body.name,
            sku: req.body.sku,
            description: req.body.description,
            price: req.body.price,
            inStock: req.body.inStock === 'true'
        };

        // If a new image is uploaded,use the multer upload the image in the server.Middleware upload.single save a single
        //file in the uploads/ folder. File information is stored in req.file
        if (req.file) {
            // Create a new Image document
            const newImage = new Image({
                img: {
                    data: fs.readFileSync(req.file.path), // Read image file data
                    contentType: req.file.mimetype        // Set the content type
                },
                name: req.file.originalname             // Set the original file name
            });

            // Save the image to the Image collection
            const savedImage = await newImage.save();

            // Add the reference (ObjectId) to the menu_images_url field in the Menu document
            updatedData.menu_images_url = savedImage._id;
        }

        // Update the menu item with the new data
        const updatedMenu = await Menu.findByIdAndUpdate(menuId, updatedData, { new: true }).populate('menu_images_url');

        res.redirect('/owner/menu');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

