import { Client, CommandInteraction } from 'discord.js';
import getLocalCommands from '../../utils/getLocalCommands.js';
import { CONFIG } from '../../../config/config.js';

export default async (Instance: Client<true>, interaction: CommandInteraction) => {
    /* check if the interaction is from chat */
    if (!interaction.isChatInputCommand) { return }
    /* get local commands */
    const localCommands = await getLocalCommands()

    try {
        /* find command */
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName)
        /* the command handler not exists */
        if (!commandObject) { return }

        /* check if the command is devOnly command */
        if (commandObject.devOnly) {
            if (!CONFIG.devAccounts.includes(interaction.member?.user.id as string)) {
                await interaction.reply({
                    content: 'Only Developers are allowd to use this command!',
                    ephemeral: true
                })
                return 
            }
        }

        /* check if the command requires is only available to selected people */
        if (commandObject.authorized) {
            if (!CONFIG.authorizedAccounts.includes(interaction.member?.user.id as string)) {
                await interaction.reply({
                    content: 'You don\'t have Permission to run this command!',
                    ephemeral: true
                })
                return 
            }
        }

        /* check if the user has enough permission to run this command */
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.memberPermissions?.has(permission)) {
                    await interaction.reply({
                        content: 'Not Enough Permissions!',
                        ephemeral: true
                    })
                    return
                }
            }
        }

        /* execute command */
        await commandObject.callback(Instance, interaction)

    } catch (error) {
        console.log(`There was an error running this command ${ (error as Error).message }`)
    }
}
