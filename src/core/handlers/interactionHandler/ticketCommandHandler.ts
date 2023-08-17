import { ButtonInteraction, Client } from 'discord.js';
import { TicketButtons } from '../../events/ready/[03]-ticketInteractions.js';

type TCustomID = typeof TicketButtons[number]['id']

export default async (Instance: Client, interaction: ButtonInteraction) => {
    /* Switch Between User Choice */
    switch (interaction.customId as TCustomID) {
        /* Automatic Ticket Handler */
        case 'ticket_automatic': {
            await interaction.reply({
                content: 'You have Created a Automatic Ticket',
                ephemeral: true
            })
            return
        }
        /* Manual Option */
        case 'ticket_manual': {
            await interaction.reply({
                content: 'You have Created a Manual Ticket',
                ephemeral: true
            })
            return
        }
    }
}
