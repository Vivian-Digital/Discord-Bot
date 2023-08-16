import path from 'path'
import fileSystem from './fileSystem.js'
import { FileDirName } from './filedirname.js'

const { __dirname } = FileDirName(import.meta)

type ModuleType = typeof import('../commands/moderation/ban.js')

export default async (exceptions: Array<string> = []) => {
    const localCommands = []
    const commandCategories = fileSystem(path.join(__dirname, '..', 'commands'), true)
    
    for (const commandCategory of commandCategories) {
        const commandFiles = fileSystem(commandCategory)
        
        for (const commandFile of commandFiles) {
            /* Ignore all sourcemap files */
            if (!/\.map/gi.test(commandFile)) {
                /* ES6 Dynamic imports with types */
                const commandObject = await import('file://' + commandFile) as ModuleType
                /* skip commands that no longer maintained */
                if (exceptions.includes(commandObject.default.name)) {
                    continue;
                }
                /* Push commands to localCommands Array */
                localCommands.push(commandObject.default)
            }
        }
    }

    return localCommands
}
