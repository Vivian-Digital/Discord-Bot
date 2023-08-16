import { Client, IntentsBitField } from 'discord.js';
import { ENV } from './config/config.js';
import EventHandler from './core/handlers/eventHandler.js';

/* Bot Instance */
const ClientInstance = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

/* Login to Discord Instance */
await ClientInstance.login(ENV.DISCORD_TOKEN)

/* Custom Events Handler */
EventHandler(ClientInstance)
