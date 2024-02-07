import { StringSelectMenuInteraction } from 'discord.js';
import { pack_types, service_pack_id } from './menu.js';
import { NewSubscription } from '../../api/handler.js';
import { InteractionEmbedBuilder, TicketActionBarBuilder } from '../../utils/builders.js';
import { UpdateTicket } from '../../controllers/tickets.js';
import { PACK_CONFIG } from '../../../config/settings.js';
import { GetPackageDetails, SetAvailablePackages } from '../../controllers/package-manager.js';

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

            const packData = await GetPackageDetails(interaction.user)
            const [config] = await Promise.all([
                NewSubscription(interaction.user, vps_id, method, sni, stream_method, packData ? packData.available_packages !== 0 : false),
                SetAvailablePackages(interaction.user, 0)
            ])
            /* Check if the User is Tried the Service */
            if (config) {
                await Promise.all([
                    interaction.reply({
                        embeds: [
                            InteractionEmbedBuilder('Gold', `Trial Created Successfully.\nExpires in \`${ new Date(config.expire).toUTCString() }\`\n\n${ config.export }`)
                        ],
                        components: [
                            TicketActionBarBuilder()
                        ]
                    }),
                    UpdateTicket(interaction.user, {
                        inboundID: config.ID,
                        pacK_id: pack,
                        port: config.port,
                        subId: config.subId,
                        email: config.email,
                        uuid: config.uuid,
                        expire: new Date(config.expire),
                        export: config.export,
                        vps_id: vps_id
                    }),
                    /* Instrunction Message (Private DM) */
                    interaction.user.send({
                        embeds: [
                            InteractionEmbedBuilder('Green', 'Software Download : ```https://github.com/Danushka-Madushan/Netch-LK/releases/download/2.0.1/Netch.7z```')
                        ],
                        content: "https://www.youtube.com/playlist?list=PL3soM7RZmff-EshZkFxz488SXuMhbT-OU"
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
