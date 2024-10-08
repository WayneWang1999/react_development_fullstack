//This is a mongodb data input tool.Can use it to produce 1 collections:tasks
//This is a individual program,not in the project.

const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be saved temporarily
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({ storage: storage });

// Import models this begin Captial word is the db collection object.
const Customer = require('./models/customer');
const Driver = require('./models/driver');
const Menu = require('./models/menu');
const Order = require('./models/order');
const Owner = require('./models/owner');
const Image = require('./models/image')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Seed data
// Seed data
// Seed data
const seedData = async () => {
    try {
        // Clear existing data
        await Customer.deleteMany();
        await Driver.deleteMany();
        await Menu.deleteMany();
        await Order.deleteMany();
        await Owner.deleteMany();
        await Image.deleteMany();
        //create image data
        const imgPath1 = path.join(__dirname, '\\public\\images\\fish.jpeg');
        const imgData1 = fs.readFileSync(imgPath1);
        const imgPath2 = path.join(__dirname, '\\public\\images\\bread.jpeg');
        const imgData2 = fs.readFileSync(imgPath2);
        const imgPath3 = path.join(__dirname, '\\public\\images\\beef.jpeg');
        const imgData3 = fs.readFileSync(imgPath3);
        const imgPath4 = path.join(__dirname, '\\public\\images\\chicken.jpeg');
        const imgData4 = fs.readFileSync(imgPath4);
        const images = await Image.create({
            name: 'fish',
            desc: 'A sample image description',
            img: {
                data: imgData1,
                contentType: 'image/jpeg'  // Change content type based on your image
            }
        },
         {
            name: 'bread',
            desc: 'A sample image description',
            img: {
                data: imgData2,
                contentType: 'image/jpeg'  // Change content type based on your image
            }
        },
        {
            name: 'beef',
            desc: 'A sample image description',
            img: {
                data: imgData3,
                contentType: 'image/jpeg'  // Change content type based on your image
            }
        },
        {
            name: 'chicken',
            desc: 'A sample image description',
            img: {
                data: imgData4,
                contentType: 'image/jpeg'  // Change content type based on your image
            }
        }
    
    
    );
        

        // Create menu data
        const menus = await Menu.create([
            {
                name: 'Fish',
                sku: 'BDJ001',
                description: 'Freshly caught fish',
                price: 79.99,
                inStock: true,
                menu_images_url: images[0]._id
            },
            {
                name: 'Bread',
                sku: 'BDJ002',
                description: 'Freshly baked bread',
                price: 5.99,
                inStock: true,
                menu_images_url: images[1]._id
            },
            {
                name: 'Beef',
                sku: 'BDJ003',
                description: 'High-quality beef',
                price: 99.99,
                inStock: true,
                menu_images_url: images[2]._id
            },
            {
                name: 'Chicken',
                sku: 'BDJ004',
                description: 'Organic chicken',
                price: 49.99,
                inStock: true,
                menu_images_url: images[3]._id
            },
        ]);

        // Create customer data first
        const customers = await Customer.create([
            {
                firstName: 'Wayne',
                lastName: 'Wang',
                email: 'wayne@abc.com',
                password: '111111',
                phone: "6132172222",
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
            {
                firstName: 'George',
                lastName: 'Potakis',
                email: 'george@abc.com',
                password: '111111',
                phone: "6132173333",
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
            {
                firstName: 'Henrique',
                lastName: 'Machitte',
                email: 'henrique@abc.com',
                password: '111111',
                phone: "6132174444",
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
        ]);

        // Create order data after customers are created
        const orders = await Order.create([
            {
                customer: customers[0]._id,  // Reference to the first customer
                delivery_Address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
                orderDate: new Date('2024-10-02'),
                order_Menus: [{
                    menu: menus[0]._id,
                    quantity: 1,
                }, {
                    menu: menus[1]._id,
                    quantity: 1,
                }],

                totalPrice: 23.3,
                orderStatus: 'New',
                driver: null, // Temporarily null
                delivered_image_url: images[0]._id,
            },
            {
                customer: customers[1]._id,  // Reference to the second customer
                delivery_Address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
                orderDate: new Date('2024-10-02'),
                order_Menus: {
                    menu: menus[0]._id,
                    quantity: 1,
                },
                totalPrice: 23.3,
                orderStatus: 'New',
                driver: null, // Temporarily null
                delivered_image_url: images[0]._id,
            },
        ]);

        // Create driver data
        const drivers = await Driver.create([
            {
                firstName: 'Driver_01',
                lastName: 'Machitte',
                email: 'driver01@abc.com',
                password: '111111',
                phone: "6132175555",
                license: "toronto01",
                order: orders[0]._id, // Reference to first order
            },
            {
                firstName: 'Driver_02',
                lastName: 'Machitte',
                email: 'driver02@abc.com',
                password: '111111',
                phone: "6132176666",
                license: "toronto02",
                order: orders[1]._id, // Reference to second order
            },
        ]);

        // Now update orders with driver references
        // await Order.updateOne({ _id: orders[0]._id }, { driver: drivers[0]._id });
        // await Order.updateOne({ _id: orders[1]._id }, { driver: drivers[1]._id });

        

        const owners = await Owner.create([
            {
                firstName: 'Owner',
                lastName: 'Wang',
                email: 'admin@abc.com',
                password: '111111',
                restaurant_name: "Noodle Restaurant",
                restaurant_menus: [menus[0]._id, menus[1]._id, menus[2]._id, menus[3]._id], // Use menu _id references
                restaurant_address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'USA',
                },
            },
        ]);


        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Error creating seed data:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run the seed function
seedData();