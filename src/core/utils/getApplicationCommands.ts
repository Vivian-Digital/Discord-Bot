import { Client } from 'discord.js';

export default async (Instance: Client<true>, guildID: string) => {
    const guild = await Instance.guilds.fetch(guildID)
    return guild.commands
}
