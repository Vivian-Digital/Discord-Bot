import { User } from 'discord.js'
import { Tickets } from '../schemas/tickets.schema.js'

/* Get users trial status */
export const isTrialExpired = async (user: User) => {
    const result = await Tickets.findOne({ ticketOwnerid: user.id })
    if (result) {
        return result.trialStatus
    }
    return false
}

export const FetchTicket = async (user: User) => {
    const result = await Tickets.findOne({ ticketOwnerid: user.id })
    if (result) {
        return result.config
    }
    return false
}

export const UpdateTicket = async (user: User, config: {
    inboundID: number,
    expire: Date,
    export: string,
    email: string | boolean,
    vps_id: number
}) => {
    await Tickets.bulkWrite([
        {
            updateOne: {
                filter: {
                    ticketOwnerid: user.id,
                },
                update: {
                    $set: {
                        ticketOwnerUsername: user.username,
                        email: config.email,
                        config: config,
                        /* Trial Used */
                        trialStatus: true
                    }
                }
            }
        }
    ])
}

/* To check if the user is already created a channel */
export const isNewTicketUser = async (user: User) => {
    const result = await Tickets.findOne({ ticketOwnerid: user.id })
    if (result) {
        return {
            dynamicChannel: result.dynamicChannel
        }
    }
    return false
}

export const NewTicket = async (user: User, channelid: string) => {
    await Tickets.bulkWrite([
        {
            updateOne: {
                filter: {
                    ticketOwnerid: user.id,
                },
                update: {
                    $set: {
                        ticketOwnerUsername: user.username,
                        dynamicChannel: channelid,
                        createdAt: new Date()
                    }
                },
                upsert: true
            }
        }
    ])
}
