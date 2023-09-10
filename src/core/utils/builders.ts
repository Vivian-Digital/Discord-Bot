import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder } from 'discord.js'
import { EMBED_DATA } from '../../config/config.js'

export const AutomaticTicketButtons = [
    {
        id: 'ticket_trial',
        label: 'Try Netch LK',
        style: ButtonStyle.Primary
    },
    {
        id: 'ticket_buy',
        label: 'Buy Access',
        style: ButtonStyle.Success
    },
    {
        id: 'ticket_manual_contact',
        label: 'Contact Staff',
        style: ButtonStyle.Danger
    }
] as const

export const InboundInfoButtons = [
    {
        id: 'ticket_status',
        label: 'Package Status',
        style: ButtonStyle.Primary
    },
    {
        id: 'upgrade_account',
        label: 'Upgrade Account',
        style: ButtonStyle.Success
    }
] as const

export const InteractionEmbedBuilder = (
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
/* {
    "status": "Active",
    "timeLeft": "23:53:51",
    "usage": {
        "allowed": "10.00 GB",
        "used": {
            "total": "0.00 GB",
            "upload": "0.00 GB",
            "download": "0.00 GB"
        }
    }
} */
export const StatusEmbedBuilder = (
    status: boolean,
    time: string,
    usage: { allowed: string, used: { total: string, upload: string, download: string } }
    ) => {
        const { allowed, used: { total } } = usage
        return new EmbedBuilder()
        .setColor(status ? 'Green' : 'Red')
        .setTitle(`\`Package Usage\` (${ status ? 'Active' : 'Expired' })`)
        .setDescription(`Subscription Ends : \`${ time }\``)
        .addFields(
            { name: 'Bandwidth', value: `\`${ allowed }\``, inline: true },
            { name: 'Usage', value: `\`${ total }\``, inline: true },
        )
        .setTimestamp()
        .setFooter({
            text: 'Netch LK Service Manger',
            iconURL: EMBED_DATA.ICONS.GREEN_SHIELD
        })
}

export const InteractionActionBarBuilder = () => {
    const actionbar = new ActionRowBuilder<ButtonBuilder>()
    /* Create Tiket Buttons */
    AutomaticTicketButtons.forEach(({ id, label, style }) => {
        actionbar.components.push(
            new ButtonBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        )
    })
    return actionbar
}

export const TicketActionBarBuilder = () => {
    const actionbar = new ActionRowBuilder<ButtonBuilder>()
    /* Create Tiket Buttons */
    InboundInfoButtons.forEach(({ id, label, style }) => {
        actionbar.components.push(
            new ButtonBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        )
    })
    return actionbar
}
