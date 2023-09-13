import mongoose from '../services/connection.js';

const TicketsSchema = new mongoose.Schema({
    ticketOwnerid: {
        type: String,
        required: true,
        unique: true
    },
    trialStatus: {
        type: Boolean,
        default: false
    },
    ticketOwnerUsername: {
        type: String,
        required: true
    },
    dynamicChannel: {
        type: String,
        required: true
    },
    config: {
        inboundID: {
            type: Number,
        },
        port: {
            type: Number,
        },
        pacK_id: {
            type: String,
        },
        subId: {
            type: mongoose.Schema.Types.Mixed,
            default: false
        },
        uuid: {
            type: mongoose.Schema.Types.Mixed,
            default: false
        },
        email: {
            type: mongoose.Schema.Types.Mixed,
            default: false
        },
        expire: {
            type: Date,
        },
        export: {
            type: String
        },
        vps_id: {
            type: Number
        }
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

export const Tickets = mongoose.model('tickets', TicketsSchema)
