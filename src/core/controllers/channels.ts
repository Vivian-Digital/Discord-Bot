import { AppEvents } from '../services/emitter.js';
import { DevelopmentLog } from '../utils/dev.js';
import { FetchActiveChannels } from './tickets.js';

export const ActiveChannels: string[] = []

AppEvents.on('fetchActiveChannels', async () => {
    const channel_data = await FetchActiveChannels()
    for (const { dynamicChannel } of channel_data) {
        ActiveChannels.push(dynamicChannel)
    }
    DevelopmentLog('Chennels Fetched', true)
})
