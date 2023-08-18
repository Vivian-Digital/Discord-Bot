import { ButtonInteraction, ChannelType, Client, ColorResolvable, EmbedBuilder, spoiler } from 'discord.js';
import { TicketButtons } from '../../events/ready/[03]-ticketInteractions.js';
import { EMBED_DATA, ENV, TICKET } from '../../../config/config.js';

type TCustomID = typeof TicketButtons[number]['id']

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

export default async (Instance: Client<true>, interaction: ButtonInteraction) => {
    /* Switch Between User Choice */
    switch (interaction.customId as TCustomID) {
        /* Automatic Ticket Handler */
        case 'ticket_automatic': {
            const Server = await Instance.guilds.fetch(ENV.GUILD_ID)
            const TicketCategory = await Server.channels.fetch(TICKET.CATEGORY_ID)
            
            if (TicketCategory) {
                const DynamicChannel = await Server.channels.create({
                    name: interaction.user.username,
                    type: ChannelType.GuildText,
                    topic: `${ interaction.user.tag }'s Ticket`,
                    reason: `Automatic Ticket Creation via ${ Instance.user.tag }`
                })

                await Promise.all([
                    interaction.reply({
                        embeds: [
                            InteractionEmbedBuilder('Green', 'Success')
                        ],
                        ephemeral: true
                    }),
                    DynamicChannel.setParent(TicketCategory.id),
                    DynamicChannel.send({
                        embeds: [
                            InteractionEmbedBuilder(
                                'Green',
                                `<@${ interaction.user.id }> have Created a Automatic Ticket \`${ spoiler(interaction.user.id) }\``
                            )
                        ],
                    })
                ])

                /* Set Channel Permissions */
                await Promise.all([
                    /* Add Service Manger to this Channel */
                    DynamicChannel.permissionOverwrites.create(TICKET.MANGER, {
                        ViewChannel: true
                    }),
                    /* Hide Channel from Everyone Else */
                    DynamicChannel.permissionOverwrites.create(Server.roles.everyone, {
                        ViewChannel: false
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
                    })
                ])
            }
            return
        }
        /* Manual Option */
        case 'ticket_manual': {
            await interaction.reply({
                content: 'You have Created a Manual Ticket',
                ephemeral: true
            })
            return
        }
    }
}
