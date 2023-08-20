import { ButtonInteraction, ChannelType, Client, ColorResolvable, EmbedBuilder, Guild, TextChannel, User, spoiler } from 'discord.js';
import { TicketButtons } from '../../events/ready/[03]-ticketInteractions.js';
import { EMBED_DATA, ENV, TICKET } from '../../../config/config.js';
import { NewTicket, isNewTicketUser } from '../../controllers/tickets.js';
import { DevelopmentLog } from '../../utils/dev.js';

type TCustomID = typeof TicketButtons[number]['id']

const InteractionLabels: Record<TCustomID, typeof TicketButtons[number]['label']> = {
    'ticket_automatic': 'Automatic',
    'ticket_manual': 'Manual'
}

const InteractionEmbedBuilder = (
    color: ColorResolvable,
    description: string
    ) => {
        return new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setTimestamp()
        .setFooter({
            text: 'Netch LK Service Manger',
            iconURL: EMBED_DATA.ICONS.GREEN_SHIELD
        })
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
    return channel
}

export default async (Instance: Client<true>, interaction: ButtonInteraction) => {
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
            SendMessages: true,
            AddReactions: true,
            ReadMessageHistory: true,
            UseApplicationCommands: true,
            /* Not Allowed */
            AttachFiles: false,
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
        NewTicket(interaction.user, DynamicChannel.id)
    ])

    const ResponseString = `<@${ interaction.user.id }> have Created a ${ InteractionLabels[(interaction.customId as TCustomID)] } Ticket`

    /* Switch Between User Choice */
    switch (interaction.customId as TCustomID) {
        /* Automatic Ticket Handler */
        case 'ticket_automatic': {
            return await DynamicChannel.send({
                embeds: [
                    InteractionEmbedBuilder(
                        'Green',
                        ResponseString
                    )
                ],
            })
        }
        /* Manual Option */
        case 'ticket_manual': {
            return await DynamicChannel.send({
                embeds: [
                    InteractionEmbedBuilder(
                        'Green',
                        `${ ResponseString }. <@&${ TICKET.STAFF_ROLE }> Member will contact you soon.`
                    )
                ],
            })
            /* Interaction Response */
        }
    }
}
