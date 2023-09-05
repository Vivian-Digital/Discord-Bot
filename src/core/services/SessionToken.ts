import got from 'got';
import { API, ENV } from '../../config/config.js';
import { DevelopmentLog } from '../utils/dev.js';
import { AppEvents } from './emitter.js';

/* Panel Access Token */
export const SessionToken: {
    'session': string,
    'expires': number
} = {
    'session': '',
    'expires': 0
}

export class SessionTokenManager {
    public static newSessionToken = async () => {
        try {
            const { headers } = await got.post(`${ API }/login`, {
                form: {
                    'username': ENV.USERNAME,
                    'password': ENV.PASSWORD
                }
            });
    
            const match = /session=(?<session>[^;]+);.+?Expires=(?<expires>[^;]+)/i.exec((headers['set-cookie'] as Array<string>)[0])
            if (match && match.groups) {
                SessionToken['session'] = match.groups['session']
                SessionToken['expires'] = new Date(match.groups['expires']).getTime()
                DevelopmentLog('Session Token Updated', true)
            }
        } catch (error) {
            DevelopmentLog('Panel Credentials Unknown', true)   
        }
    }

    public static isSessionExpired = () => {
        return Date.now() > SessionToken.expires
    }
}

/* Initiate the App with a New Token */
AppEvents.on('onSession', async () => {
    await SessionTokenManager.newSessionToken()
})
