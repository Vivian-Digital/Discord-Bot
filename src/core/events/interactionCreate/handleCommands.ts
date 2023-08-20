import { ButtonInteraction, Client, CommandInteraction } from 'discord.js';
import SlashCommandHandler from '../../handlers/interactionHandler/slashCommandHandler.js';
import TicketCommandHandler from '../../handlers/interactionHandler/ticketCommandHandler.js';

export default async (Instance: Client<true>, interaction: CommandInteraction | ButtonInteraction) => {
    /* check if the interaction is from chat */
    if (interaction.isChatInputCommand()) {
        await SlashCommandHandler(Instance, interaction)
        return
    /* check if the interaction is from a ticket */
    } else if (interaction.isButton()) {
        await TicketCommandHandler(Instance, interaction)
        return
    }
}
