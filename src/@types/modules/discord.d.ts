declare module 'Instance-Types' {
    import { Client, CommandInteraction, ApplicationCommandOptionData, PermissionResolvable } from 'discord.js'
    
    interface TlocalCommand {
        /**
         * Slash command name (must be the same name of the file)
         */
        name: string,
        /**
         * Slash command description
         */
        description: string,
        /**
         * is command devOnly
         */
        devOnly?: boolean,
        /**
         * command required authorization
         */
        authorized: boolean
        /**
         * is command marked as delete
         */
        deleted: boolean,
        /**
         * Slash command Options
         */
        options?: Array<ApplicationCommandOptionData>,
        /**
         * Slash command usage Permissions
         */
        permissionsRequired?: Array<PermissionResolvable>,
        /**
         * Event handler function.
         *
         * @param Instance - Discord Client Instance
         * @param interaction - Command Interaction
         */
        callback: (Instance: Client<true>, interaction: CommandInteraction) => Promise<void> | void
    }
}
