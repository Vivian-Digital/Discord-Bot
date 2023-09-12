import { ButtonInteraction, ChannelType, Client, EmbedBuilder, Guild, TextChannel, User, spoiler } from 'discord.js';
import { TicketButtons } from '../../events/ready/[03]-ticketInteractions.js';
import { EMBED_DATA, ENV, TICKET } from '../../../config/config.js';
import { NewTicket, isNewTicketUser, isTrialExpired } from '../../controllers/tickets.js';
import { DevelopmentLog } from '../../utils/dev.js';
import { InboundStatus } from '../../api/handler.js';
import { AutomaticTicketButtons, InboundInfoButtons, InteractionActionBarBuilder, InteractionEmbedBuilder, StatusEmbedBuilder } from '../../utils/builders.js';
import { ServicePackSelectMenu } from '../selectManuHandler/menu.js';
import { ActiveChannels } from '../../controllers/channels.js';

type TicketCusomID = typeof AutomaticTicketButtons[number]['id']
type TCustomID = typeof TicketButtons[number]['id']
type TInboundInfoID = typeof InboundInfoButtons[number]['id']

const TicketInteractionArray: Array<TicketCusomID> = [ 'ticket_buy', 'ticket_manual_contact', 'ticket_trial' ]
const InboundInteractionArray: Array<TInboundInfoID> = [ 'ticket_status', 'upgrade_account' ]

const InteractionLabels: Record<TCustomID, typeof TicketButtons[number]['label']> = {
    'ticket_automatic': 'Automatic',
    'ticket_manual': 'Manual'
}

const NewDynamicChannel = async (server: Guild, Instance: Client<true>, user: User) => {
    const ExistingChannel = await isNewTicketUser(user)
    if (ExistingChannel) {
        try {
            const channel = await server.channels.fetch(ExistingChannel.dynamicChannel)
            if (channel && channel.isTextBased()) {
                /* Send Existing Channel if Exists */
                return channel as TextChannel
            }
        } catch (error) {
            /* Someone Deleted the Channel */
            DevelopmentLog('Channel Deleted Creating a new One!')
        }
    }
    /* Create New Channel */
    const channel = await server.channels.create({
        name: user.username,
        type: ChannelType.GuildText,
        topic: `${ user.tag }'s Ticket`,
        reason: `Automatic Ticket Creation via ${ Instance.user.tag }`
    })

    /* Push Channel id to Active Channels Array */
    ActiveChannels.push(channel.id)

    return channel
}

export default async (Instance: Client<true>, interaction: ButtonInteraction) => {
    /* if the interaction is from action button inside dynamic Channel */
    if (InboundInteractionArray.includes(interaction.customId as TInboundInfoID)) {
        switch (interaction.customId as TInboundInfoID) {
            /* Self Service options (Pack Stat | Upgrade Account) */
            case 'ticket_status': {
                const stats = await InboundStatus(interaction.user)
                if (stats) {
                    const { status, timeLeft, usage } = stats
                    return await interaction.reply({
                        embeds: [
                            StatusEmbedBuilder(status, timeLeft, usage)
                        ]
                    })
                }
                /* Trial Creation Failed */
                return await interaction.reply({
                    embeds: [
                        InteractionEmbedBuilder('Red', 'You haven\'t bought any services yet!')
                    ]
                })
            }
            case 'upgrade_account': {
                return
            }
        }
    }

    /* if the interaction is from dynamic Channel */
    if (TicketInteractionArray.includes(interaction.customId as TicketCusomID)) {
        switch (interaction.customId as TicketCusomID) {
            /* Self Serfvice Options (Trial) */
            case 'ticket_trial': {
                const trial_status = await isTrialExpired(interaction.user)

                if (!trial_status) {
                    return await interaction.reply({
                        components: [
                            ServicePackSelectMenu()
                        ]
                    })
                }

                /* Trial Creation Failed */
                return await interaction.reply({
                    embeds: [
                        InteractionEmbedBuilder('Red', 'Trial already Used. Consider Upgrading Your Plan')
                    ]
                })
            }
            /* Self Serfvice Options (Trial) */
            case 'ticket_manual_contact': {
                return await interaction.reply({
                    embeds: [
                        InteractionEmbedBuilder(
                            'Red',
                            `<@&${ TICKET.STAFF_ROLE }> Member will contact you soon. Remember it is our first priority to give best service to you. but we have lifes too. so be patience if there is no staff members currently active. they will contact you ASAP once they online`
                        )
                    ],
                })
            }
            /* Self Serfvice Options (Trial) */
            case 'ticket_buy': {
                return await interaction.reply({
                    embeds: [
                        InteractionEmbedBuilder('Green', 'Thanks for Buying our serivice')
                    ]
                })
            }
        }
    }

    /* Get Guild(server) and ticket category */
    const Guild = await Instance.guilds.fetch(ENV.GUILD_ID)
    const TicketCategory = await Guild.channels.fetch(TICKET.CATEGORY_ID)

    /* Channel Category Does not Exists */
    if (!TicketCategory) {
        return await interaction.reply({
            embeds: [
                InteractionEmbedBuilder(
                    'Red',
                    `\`ALL TICKETS\` Category Does not Exists \`ID\`:\`${ spoiler(TICKET.CATEGORY_ID) }\``
                )
            ],
            ephemeral: true
        })
    }

    /* Interaction Response & Channel Creation */
    const [DynamicChannel] = await Promise.all([
        NewDynamicChannel(Guild, Instance, interaction.user),
        interaction.reply({
            embeds: [
                InteractionEmbedBuilder('Green', 'Success')
            ],
            ephemeral: true
        })
    ])

    /* Handle Dynamic Channel */
    await Promise.all([
        /* Send Reply to Interaction Channel */
        DynamicChannel.setParent(TicketCategory.id),
        /* Add Ticket to Database */
        NewTicket(interaction.user, DynamicChannel.id)
    ])

    await Promise.all([
        /* Hide Channel from Everyone Else */
        DynamicChannel.permissionOverwrites.create(Guild.roles.everyone, {
            ViewChannel: false
        }),
        /* Add Service Manger to this Channel */
        DynamicChannel.permissionOverwrites.create(TICKET.MANGER, {
            ViewChannel: true
        }),
        /* Ticket Creators Permissions */
        DynamicChannel.permissionOverwrites.create(interaction.user.id, {
            /* Allowed */
            ViewChannel: true,
            AddReactions: true,
            ReadMessageHistory: true,
            UseApplicationCommands: true,
            /* Not Allowed */
            AttachFiles: false,
            SendMessages: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            CreateInstantInvite: false,
            EmbedLinks: false,
            ManageThreads: false,
            ManageMessages: false,
            ManageRoles: false,
            ManageWebhooks: false,
            ManageChannels: false,
            MentionEveryone: false,
            SendVoiceMessages: false,
            SendMessagesInThreads: false,
            UseExternalEmojis: false,
            UseExternalStickers: false,
        }),
    ])

    const ResponseString = `<@${ interaction.user.id }> have Created a ${ InteractionLabels[(interaction.customId as TCustomID)] } Ticket`

    /* Switch Between User Choice */
    switch (interaction.customId as TCustomID) {
        /* Automatic Ticket Handler */
        case 'ticket_automatic': {
            const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`${ ResponseString }`)
            .setThumbnail(EMBED_DATA.THUMBNAILS.BLUE_HOST_SERVER)
            .setTimestamp()
            .addFields(
                {
                    name: '`Buy Service`',
                    value: 'Get Full Access to Netch LK Servers + Unlimited Badwith'
                },
                {
                    name: '`Try Netch LK`',
                    value: 'Try Our Service For 1 Day with a 10GB Up/Down Bandwith'
                },
                {
                    name: '`Contact Staff`',
                    value: 'Contact a Staff `(ONLY IF NECESSARY)`'
                },
            )
            .setFooter({
                text: 'Netch LK Service Manger',
                iconURL: EMBED_DATA.ICONS.GREEN_SHIELD
            })

            return await DynamicChannel.send({
                embeds: [embed],
                components: [
                    InteractionActionBarBuilder()
                ],
            })
        }
        /* Manual Option */
        case 'ticket_manual': {
            /* Interaction Response */
            return await DynamicChannel.send({
                embeds: [
                    InteractionEmbedBuilder(
                        'Green',
                        `${ ResponseString }. <@&${ TICKET.STAFF_ROLE }> Member will contact you soon.`
                    )
                ],
            })
        }
    }
}
