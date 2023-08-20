import mongoose from '../services/connection.js';

const TicketsSchema = new mongoose.Schema({
    ticketOwnerid: {
        type: String,
        required: true,
        unique: true
    },
    ticketOwnerUsername: {
        type: String,
        required: true
    },
    dynamicChannel: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

export const Tickets = mongoose.model('tickets', TicketsSchema)
