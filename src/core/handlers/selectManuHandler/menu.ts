import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';

const pack_icon = '1091714334020878356'

const service_packs = [
    {
        labeL: 'SLT',
        description: 'Zoom',
        value: 'slt_zoom',
        icon: pack_icon
    },
    {
        labeL: 'SLT',
        description: 'Entertainment Combo Pack (Netflix)',
        value: 'slt_netflix',
        icon: pack_icon
    },
    {
        labeL: 'SLT',
        description: 'Flash 10/5',
        value: 'slt_flash',
        icon: pack_icon
    },
    {
        labeL: 'Dialog Boradband',
        description: 'Unlimited 2 Mbps',
        value: 'dialog_unlimited_2mbps',
        icon: pack_icon
    },
    {
        labeL: 'Dialog Boradband',
        description: 'Zoom',
        value: 'dialog_zoom',
        icon: pack_icon
    },
    /* {
        labeL: 'Mobitel',
        description: 'Massaging Plan (WhatsApp Unlimited)',
        value: 'mobitel_messaging_whatsapp',
        icon: pack_icon
    }, */
    {
        labeL: 'Hutch',
        description: 'Ultimate Gamer Pro (Daily 10 GB)',
        value: 'hutch_ultimate_gamer',
        icon: pack_icon
    },
    {
        labeL: 'Airtel',
        description: 'Freedom',
        value: 'airtel_freedom',
        icon: pack_icon
    }
] as const

export type pack_types = typeof service_packs[number]['value']

export const service_pack_id = 'pack_select_menu'

export const ServicePackSelectMenu = () => {
    const select_menu = new StringSelectMenuBuilder()
    .setCustomId(service_pack_id)
    .setPlaceholder('Select Package')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(service_packs.map(({ labeL, value, description, icon }) => {
        return new StringSelectMenuOptionBuilder()
            .setLabel(labeL)
            .setValue(value)
            .setDescription(description)
            .setEmoji(icon)
    }))
    
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu)
}
