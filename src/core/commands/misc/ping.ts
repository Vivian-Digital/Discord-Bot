import { TlocalCommand } from 'Instance-Types';
import { Client, CommandInteraction } from 'discord.js';

const Function: TlocalCommand = {
    name: 'ping',
    description: 'Pong!',
    devOnly: true,
    authorized: false,
    deleted: false,
    
    callback: async (Instance: Client<true>, interaction: CommandInteraction) => {
        await interaction.reply(`Pong! ${ Instance.ws.ping } ms`)
    }
}

export default Function
