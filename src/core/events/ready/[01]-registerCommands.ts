import { Client } from 'discord.js'
import { ENV } from '../../../config/config.js'
import { DevelopmentLog } from '../../utils/dev.js'
import getApplicationCommands from '../../utils/getApplicationCommands.js'
import getLocalCommands from '../../utils/getLocalCommands.js'

/* Slash Commands Handler */
export default async (Instance: Client<true>) => {
    try {
        const localCommands = await getLocalCommands()
        const applicationCommands = await getApplicationCommands(Instance, ENV.GUILD_ID)
        
        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand

            if (localCommand.deleted) {
                DevelopmentLog(`Skipping command ${ name } as it's set to be Delted!`)
                continue
            } else {
                await applicationCommands.create({
                    name: name,
                    description: description,
                    options: options
                })
                DevelopmentLog(`Registering command ${ name }`)
            }
        }
    } catch (error) {
        console.log(`Error on command registering! ${ (error as Error).message }`)
    }
}
