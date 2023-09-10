import { ButtonInteraction, Client, CommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import SlashCommandHandler from '../../handlers/interactionHandler/slashCommandHandler.js';
import TicketCommandHandler from '../../handlers/interactionHandler/ticketCommandHandler.js';
import { SelectMenuCollector } from '../../handlers/selectManuHandler/collector.js';

export default async (Instance: Client<true>, interaction: CommandInteraction | ButtonInteraction | StringSelectMenuInteraction) => {
    /* check if the interaction is from chat */
    if (interaction.isChatInputCommand()) {
        await SlashCommandHandler(Instance, interaction)
    /* Check if the interaction is from a select menu */
    } else if (interaction.isStringSelectMenu()) {
        await SelectMenuCollector(interaction)
    /* check if the interaction is from a ticket */
    } else if (interaction.isButton()) {
        await TicketCommandHandler(Instance, interaction)
    }
}
