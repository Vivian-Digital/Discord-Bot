import { pack_types } from '../core/handlers/selectManuHandler/menu.js';
import { ENV } from './config.js';

type iServerConfig = Record<number, {
    api: `https://${ string }.netchlk.org:${ number }`,
    credentials: {
        username: string,
        password: string,
    }
    domain: () => string
}>

const DomainRegex = (key: number, object: iServerConfig) => {
    const re = /https?:\/\/(?<domain>.+?netchlk[.]org):\d+$/i.exec(object[key].api) as RegExpExecArray
    return (re.groups?.domain as string)
}

export const CERTIFICATES = {
    "defaultCert": (domain: string) => {
        return `/root/cert/${ domain }/fullchain.pem`
    },
    "defaultKey": (domain: string) => {
        return `/root/cert/${ domain }/privkey.pem`
    },
} as const

export const SERVER_CONFIG: iServerConfig = {
    1: {
        api: ENV.CREDENTIALS.ZOOM_VPS.API,
        credentials: {
            username: ENV.CREDENTIALS.ZOOM_VPS.USERNAME,
            password: ENV.CREDENTIALS.ZOOM_VPS.PASSWORD,
        },
        domain: () => {
            return DomainRegex(1, SERVER_CONFIG)
        }
    },
    2: {
        api: ENV.CREDENTIALS.VPS_1.API,
        credentials: {
            username: ENV.CREDENTIALS.VPS_1.USERNAME,
            password: ENV.CREDENTIALS.VPS_1.PASSWORD,
        },
        domain: () => {
            return DomainRegex(2, SERVER_CONFIG)
        }
    },
    3: {
        api: ENV.CREDENTIALS.VPS_2.API,
        credentials: {
            username: ENV.CREDENTIALS.VPS_2.USERNAME,
            password: ENV.CREDENTIALS.VPS_2.PASSWORD,
        },
        domain: () => {
            return DomainRegex(3, SERVER_CONFIG)
        }
    },
    4: {
        api: ENV.CREDENTIALS.VPS_3.API,
        credentials: {
            username: ENV.CREDENTIALS.VPS_3.USERNAME,
            password: ENV.CREDENTIALS.VPS_3.PASSWORD,
        },
        domain: () => {
            return DomainRegex(4, SERVER_CONFIG)
        }
    }
} as const

export const PACK_CONFIG: Record<pack_types, {
    sni: string,
    method: 'vless' | 'vmess',
    stream_method: 'ws' | 'tls'
    vps_id: number
}> = {
    slt_zoom: {
        sni: 'm.zoom.us',
        method: 'vless',
        vps_id: 4,
        stream_method: 'tls'
    },
    slt_flash: {
        sni: 'm.zoom.us',
        method: 'vless',
        vps_id: 4,
        stream_method: 'tls'
    },
    slt_netflix: {
        sni: 'm.netflix.com',
        method: 'vless',
        vps_id: 4,
        stream_method: 'tls'
    },
    dialog_zoom: {
        sni: 'm.zoom.us',
        method: 'vless',
        vps_id: 1,
        stream_method: 'tls'
    },
    dialog_unlimited_2mbps: {
        sni: 'store.steampowered.com',
        method: 'vless',
        vps_id: 4,
        stream_method: 'tls'
    },
    mobitel_messaging_whatsapp: {
        sni: 'mix-cn.linkedin.com',
        method: 'vmess',
        vps_id: 1,
        stream_method: 'ws'
    },
    hutch_ultimate_gamer: {
        sni: 'store.steampowered.com',
        method: 'vless',
        vps_id: 3,
        stream_method: 'tls'
    },
    airtel_freedom: {
        sni: 'docs.google.com',
        method: 'vless',
        vps_id: 1,
        stream_method: 'tls'
    }
}
