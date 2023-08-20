import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder } from 'discord.js';
import { EMBED_DATA, TICKET } from '../../../config/config.js';
import { DevelopmentLog } from '../../utils/dev.js';

export const TicketButtons = [
    {
        id: 'ticket_automatic',
        label: 'Automatic',
        style: ButtonStyle.Success
    },
    {
        id: 'ticket_manual',
        label: 'Manual',
        style: ButtonStyle.Success
    }
] as const

/* Ticket Handler */
export default async (Instance: Client<true>) => {
    const TicketChannel = await Instance.channels.fetch(TICKET.CHANNEL_ID)
    if (!TicketChannel) {
        DevelopmentLog(`Ticket Channel Does not exists!`, true)
        return
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
    /* Create Tiket Buttons */
    TicketButtons.forEach(({ id, label, style }) => {
        row.components.push(
            new ButtonBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        )
    })

    /* Embed Builder */
    const embed = new EmbedBuilder()
    .setTitle('OPEN A TICKET')
    .setDescription('Use Automatic option for `SELF-SERVICE`, or Use Manual option for contact a `MANAGER`')
    .setTimestamp()
    .setThumbnail(EMBED_DATA.THUMBNAILS.NEON_BOOKMARK)
    .setFooter({
        text: 'Netch LK Service Manger',
        iconURL: EMBED_DATA.ICONS.GREEN_SHIELD
    })

    if (TicketChannel.isTextBased()) {
        await TicketChannel.send({
            components: [row],
            embeds: [embed]
        })
    }
}
