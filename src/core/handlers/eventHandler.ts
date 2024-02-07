import { Client, CommandInteraction, Message } from 'discord.js';
import { FileDirName } from '../utils/filedirname.js';
import fileSystem from '../utils/fileSystem.js';
import path from 'path';

const { __dirname } = FileDirName(import.meta)

type TArgs = CommandInteraction | Message
type ModuleType = typeof import('../events/interactionCreate/handleCommands.js')

/* Event Handler */
export default (Instance: Client<true>) => {
    /* Get All Event Folders */
    const eventFolders = fileSystem(path.join(__dirname, '..', 'events'), true)

    /* Get All Event Files in Event Folders */
    for (const eventFolder of eventFolders) {
        const eventFiles = fileSystem(eventFolder)
        /* Give Priority over other files using [P0N] level */
        eventFiles.sort((a, b) => {
            const P1 = /\[P(?<priority>[0-9]+)\]/i.exec(a)
            const P2 = /\[P(?<priority>[0-9]+)\]/i.exec(b)

            if ((P1 && P1.groups) && (P2 && P2.groups)) {
                return P1.groups.priority > P2.groups.priority ? 1 : -1
            }

            return a > b ? 1 : -1
        })

        /* Get eventName (based on the filename) */
        const eventName = eventFolder.replace(/\\/gi, '/').split('/').pop() as string
        /* pass event listner to each event handler files */
        Instance.on(eventName, async (arg: TArgs) => {
            for (const eventFile of eventFiles) {
                /* Ignore all sourcemap files */
                if (!/\.map/gi.test(eventFile)) {
                    /* ES6 Dynamic imports with types */
                    const eventModule = await import('file://' + eventFile) as ModuleType
                    /* call the default function of event module */
                    await eventModule.default(Instance, (arg as CommandInteraction))
                }
            }
        })
    }
}
