import { User } from 'discord.js'
import { Tickets } from '../schemas/tickets.schema.js'

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
