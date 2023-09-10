import got, { Response } from 'got';
import { DevelopmentLog } from '../utils/dev.js';
import { AppEvents } from './emitter.js';
import { SERVER_CONFIG } from '../../config/settings.js';

/* Panel Access Token */
export const SessionToken: {
    'session': Record<number, string>,
    'expires': Record<number, number>
} = {
    'session': {
        1: '',
        2: '',
        3: '',
        4: ''
    },
    'expires': {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    }
}

export class SessionTokenManager {
    public static newSessionToken = async () => {
        const keys = Object.keys(SERVER_CONFIG)
        const Promises: Array<Promise<Response>> = []

        for (const key of keys) {
            const { api, credentials: { username, password } } = SERVER_CONFIG[parseInt(key)]
            Promises.push(got.post(`${ api }/login`, {
                form: {
                    'username': username,
                    'password': password
                }
            }))
        }

        let key = 1

        try {
            const Responses = await Promise.all(Promises)
            for (const { headers } of Responses) {
                const match = /session=(?<session>[^;]+);.+?Expires=(?<expires>[^;]+)/i.exec((headers['set-cookie'] as Array<string>)[0])
                if (match && match.groups) {
                    SessionToken['session'][key] = match.groups['session']
                    SessionToken['expires'][key] = new Date(match.groups['expires']).getTime()
                    DevelopmentLog(`Session Token Updated [VPS-${ key }]`, true)
                    key ++
                }
            }
        } catch (error) {
            DevelopmentLog(`Panel Credentials Unknown [VPS-${ key }]`, true)   
        }
    }

    public static isSessionExpired = (key: number) => {
        return Date.now() > SessionToken.expires[key]
    }
}

/* Initiate the App with a New Token */
AppEvents.on('onSession', async () => {
    await SessionTokenManager.newSessionToken()
})
