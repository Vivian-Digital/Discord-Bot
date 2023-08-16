import { TlocalCommand } from 'Instance-Types';
import { Client, CommandInteraction, ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import { FileDirName } from '../../utils/filedirname.js';

const { __exactname } = FileDirName(import.meta)

const Function: TlocalCommand = {
    name: __exactname,
    description: 'Ban a member from the server',
    deleted: false,
    authorized: true,
    options: [
        {
            name: 'target-users',
            description: 'The user to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'Ban Reason',
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [
        PermissionFlagsBits.Administrator
    ],
    
    callback: async (Instance: Client<true>, interaction: CommandInteraction) => {
        await interaction.reply(`Ban ${ Instance.ws.ping } ms`)
    }
}

export default Function
