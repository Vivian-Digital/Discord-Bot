import { StringSelectMenuInteraction, spoiler } from 'discord.js';
import { pack_types, service_pack_id } from './menu.js';
import { NewTrial } from '../../api/handler.js';
import { InteractionEmbedBuilder, TicketActionBarBuilder } from '../../utils/builders.js';
import { UpdateTicket } from '../../controllers/tickets.js';
import { PACK_CONFIG } from '../../../config/settings.js';

type customIDS = typeof service_pack_id

export const SelectMenuCollector = async (interaction: StringSelectMenuInteraction) => {
    if (!interaction.values.length) {
        await interaction.reply({
            content: 'Please Select at least 1 entry'
        })
        return
    }

    switch (interaction.customId as customIDS) {
        case 'pack_select_menu': {
            const pack = (interaction.values as pack_types[])[0]
            const { method, sni, vps_id, stream_method } = PACK_CONFIG[pack]

            const config = await NewTrial(interaction.user, vps_id, method, sni, stream_method)
            /* Check if the User is Tried the Service */
            if (config) {
                await Promise.all([
                    interaction.reply({
                        embeds: [
                            InteractionEmbedBuilder('Gold', `Trial Created Successfully.\nExpires in \`${ new Date(config.expire).toUTCString() }\`\n\n${ spoiler(`\`\`\`${ config.export }\`\`\``) }`)
                        ],
                        components: [
                            TicketActionBarBuilder()
                        ]
                    }),
                    UpdateTicket(interaction.user, {
                        inboundID: config.ID,
                        email: config.email,
                        expire: new Date(config.expire),
                        export: config.export,
                        vps_id: vps_id
                    }),
                    /* Instrunction Message (Private DM) */
                    interaction.user.send({
                        content: 'https://www.youtube.com/watch?v=JfHVv3nuWHI'
                    })
                ])
                return
            }

            /* Trial Creation Failed */
            await interaction.reply({
                embeds: [
                    InteractionEmbedBuilder('Red', 'Trial already Used. Consider Upgrading Your Plan')
                ]
            })
        }
    }
}
