import mongoose from '../services/connection.js';

const packages = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    available_packages: {
        type: Number,
        required: true,
        default: 0
    },
    waiting_status: {
        type: String,
        required: true,
        enum: [ 'trial', 'buy_new', 'upgrade' ],
        default: 'trial'
    }
})

export const Packages = mongoose.model('packages', packages)
