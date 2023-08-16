import { Client } from 'discord.js'
import { ENV } from '../../../config/config.js'
import { DevelopmentLog } from '../../utils/dev.js'
import getApplicationCommands from '../../utils/getApplicationCommands.js'
import getLocalCommands from '../../utils/getLocalCommands.js'

/* Slash Commands Handler */
export default async (Instance: Client<true>) => {
    try {
        const [ localCommands, applicationCommands ] = await Promise.all([
            getLocalCommands(),
            getApplicationCommands(Instance, ENV.GUILD_ID)
        ])
        
        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand

            if (localCommand.deleted) {
                DevelopmentLog(`Skipping command ${ name } as it's set to be Delted!`, true)
                continue
            } else {
                await applicationCommands.create({
                    name: name,
                    description: description,
                    options: options
                })
                DevelopmentLog(`Registering Command ( ${ name } )`, true)
                /* Use Below Function if there are commands that need to be deleted */
                /* for (const id of CONFIG.deleteQueue) {
                    await applicationCommands.delete(id)
                } */
            }
        }
    } catch (error) {
        console.log(`Error on command registering! ${ (error as Error).message }`)
    }
}
