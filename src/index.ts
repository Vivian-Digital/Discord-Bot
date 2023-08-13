import { Client, IntentsBitField } from 'discord.js';
import { EventHandler } from './core/discord/eventhandler.js';
import { ENV } from './config/config.js';

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

/* Handle Events */
EventHandler(ClientInstance)
