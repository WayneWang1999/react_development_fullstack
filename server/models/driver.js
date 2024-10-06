const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    phone:{type:String,required:true},
    license:{type:String,required:true},
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },

}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);