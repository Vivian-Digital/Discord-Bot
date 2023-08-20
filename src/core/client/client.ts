import { Client, IntentsBitField } from 'discord.js';
import EventHandler from '../handlers/eventHandler.js';
import { ENV } from '../../config/config.js';
import { AppEvents } from '../services/emitter.js';

/* Bot Instance */
export const ClientInstance = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

AppEvents.on('onDBReady', async () => {
    /* Start Discord bot when Application is ready */
    await ClientInstance.login(ENV.DISCORD_TOKEN)
    /* Custom Events Handler */
    EventHandler(ClientInstance)
    /* Initialize Express Web Server */
    AppEvents.emit('Ready')
})
