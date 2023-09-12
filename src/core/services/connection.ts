import mongoose from 'mongoose'
import { DevelopmentLog } from '../utils/dev.js';
import { ENV } from '../../config/config.js';
import { AppEvents } from './emitter.js';

AppEvents.on('onReady', async () => {
    await mongoose.connect(ENV.CONNECTION_URI,)
})

mongoose.connection.on('connected', () => {
    DevelopmentLog('Mongodb Connected', true)
    /* Emit start signal to bot controller */
    AppEvents.emit('onDBReady')
    /* Get Session Token From Panel API */
    AppEvents.emit('onSession')
    /* Fetch Active Channels */
    AppEvents.emit('fetchActiveChannels')
})

export default mongoose
