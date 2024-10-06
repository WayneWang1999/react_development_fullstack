const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    phone:{type:String,required:true},
    customerAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);