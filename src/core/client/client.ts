import { Client, IntentsBitField, Partials, GatewayIntentBits } from 'discord.js';
import EventHandler from '../handlers/eventHandler.js';
import { ENV } from '../../config/config.js';
import { AppEvents } from '../services/emitter.js';

/* Bot Instance */
export const ClientInstance = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [ Partials.Message, Partials.Channel, Partials.Reaction ],
})

AppEvents.on('onDBReady', async () => {
    /* Start Discord bot when Application is ready */
    await ClientInstance.login(ENV.DISCORD_TOKEN)
    /* Custom Events Handler */
    EventHandler(ClientInstance)
    /* Initialize Express Web Server */
    AppEvents.emit('Ready')
})
