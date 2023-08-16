import { Client, IntentsBitField } from 'discord.js';
import EventHandler from '../handlers/eventHandler.js';
import { AppEvents } from '../services/emitter.js';
import { ENV } from '../../config/config.js';

/* Bot Instance */
export const ClientInstance = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

/* Start Discord bot when Application is ready */
AppEvents.on('onReady', async () => {
    await ClientInstance.login(ENV.DISCORD_TOKEN)
    /* Emit start signal to bot controller */
    AppEvents.emit('Ready')
    /* Custom Events Handler */
    EventHandler(ClientInstance)
})
