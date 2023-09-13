import { User } from 'discord.js'
import { Tickets } from '../schemas/tickets.schema.js'
import { NewPackageUser } from './package-manager.js'

/* Get users trial status */
export const isTrialExpired = async (user: User, isPaid: boolean) => {
    if (isPaid) { return false }
    const result = await Tickets.findOne({ ticketOwnerid: user.id })
    if (result) {
        return result.trialStatus
    }
    return false
}

export const FetchActiveChannels = async () => {
    return await Tickets.aggregate<{
        ticketOwnerid: string,
        dynamicChannel: string
    }>([
        {
            '$project': {
                trialStatus: 0,
                ticketOwnerUsername: 0,
                config: 0,
                createdAt: 0
            }
        }
    ])
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
    port: number,
    pacK_id: string,
    subId: string | boolean,
    uuid: string | boolean,
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
    await Promise.all([
        Tickets.bulkWrite([
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
        ]),
        /* Create Blank Package under the same user */
        NewPackageUser(user)
    ])
}
