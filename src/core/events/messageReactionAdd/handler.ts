import { Client, MessageReaction } from 'discord.js';
import { InteractionEmbedBuilder } from '../../utils/builders.js';
import { ActiveChannels } from '../../controllers/channels.js';
import { TICKET } from '../../../config/config.js';
import { GetPackageDetails, SetAvailablePackages, iWorkflowPackageStatus } from '../../controllers/package-manager.js';
import { ServicePackSelectMenu } from '../../handlers/selectManuHandler/menu.js';
import { UpgradeSubscription } from '../../api/handler.js';

const Reactions = {
	'✅': 'accepted',
	'❌': 'reject',
	'🔔': 'ack' 
} as const

export default async (Instance: Client<true>, reaction: MessageReaction) => {
	/* Check if the Reaction is from a Ticket Channel */
	if (ActiveChannels.includes(reaction.message.channelId)) {
		if (reaction.partial) {
			try {
				await reaction.fetch()
			} catch (error) {
				console.error('Something went wrong when fetching the message:', error)
				return
			}
		}
	
		if (reaction.message.author) {
			const reacted_users = await reaction.users.fetch()
	
			switch (Reactions[reaction.emoji.name as keyof typeof Reactions]) {
				case 'accepted': {
					for (const [userid] of reacted_users) {
						if (userid !== reaction.message.author.id) {
							const pack = await GetPackageDetails(reaction.message.author)
							if (!pack) {
								return await reaction.message.reply({
									embeds: [
										InteractionEmbedBuilder('Red', `Package Data Missiong. Pelase Contact <@&${ TICKET.STAFF_ROLE }> Member`)
									]
								})
							}

							/* Give 1 Purchase */
							await SetAvailablePackages(reaction.message.author, 1)
							
							switch (pack.waiting_status as Exclude<iWorkflowPackageStatus, 'trial'>) {
								case 'buy_new' : {
									await reaction.message.reply({
										components: [
											ServicePackSelectMenu()
										]
									})
									break
								}
								case 'upgrade': {
									await Promise.all([
										UpgradeSubscription(reaction.message.author),
										reaction.message.reply({
											embeds: [
												InteractionEmbedBuilder('Green', '`Your Current Package is Upgraded to Unlimited Bandwith and Expire in 1 Month`')
											]
										})
									])
									break
								}
							}
						}
					}
					return
				}
				case 'ack': {
					for (const [userid] of reacted_users) {
						if (userid === reaction.message.author.id) {
							await reaction.message.reply({
								embeds: [
									InteractionEmbedBuilder('Green', `Your Reciept has been accepted wait until <@&${ TICKET.STAFF_ROLE }> approval`)
								]
							})
						}
					}
					return
				}
				case 'reject': {
					await Promise.all([
						SetAvailablePackages(reaction.message.author, 0),
						reaction.message.reply({
							embeds: [
								InteractionEmbedBuilder('Red', 'Your Reciept is Rejected')
							]
						})
					])
					return
				}
			}
		}
	}
	return
}
