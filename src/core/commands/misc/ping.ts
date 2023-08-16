import { TlocalCommand } from 'Instance-Types';
import { Client, CommandInteraction } from 'discord.js';
import { FileDirName } from '../../utils/filedirname.js';

const { __exactname } = FileDirName(import.meta)

const Function: TlocalCommand = {
    name: __exactname,
    description: 'Pong!',
    devOnly: true,
    authorized: false,
    deleted: false,
    
    callback: async (Instance: Client<true>, interaction: CommandInteraction) => {
        await interaction.reply(`Pong! ${ Instance.ws.ping } ms`)
    }
}

export default Function
