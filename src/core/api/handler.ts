import got from 'got';
import { User } from 'discord.js';
import { FetchTicket, isTrialExpired } from '../controllers/tickets.js';
import { SessionToken, SessionTokenManager } from '../services/SessionToken.js';
import { TListResponse, TListResponseSetting, TResponse } from 'panel/API';
import { DevelopmentLog } from '../utils/dev.js';
import { CompareUnixTime, FutureTimeStamp, GenerateInboundFillData, ParseInboundResponse } from './api-functions.js';
import { CERTIFICATES, SERVER_CONFIG } from '../../config/settings.js';

const RefreshSession = async (key: number) => {
    /* Check if the Session token is Expired */
    if (SessionTokenManager.isSessionExpired(key)) {
        DevelopmentLog('Session Token Expired. Generating a New Token')
        await SessionTokenManager.newSessionToken()
    }
}

const GetStreamSettings = (method: 'tls' | 'ws', domain: () => string, sni: string) => {
    switch (method) {
        case 'ws': {
            return {
                "network": "ws",
                "security": "none",
                "wsSettings": {
                    "acceptProxyProtocol": false,
                    "path": "/",
                    "headers": {}
                }
            }
        }
        case 'tls': {
            return {
                "network": "tcp",
                "security": "tls",
                "tlsSettings": {
                    "serverName": "",
                    "minVersion": "1.2",
                    "maxVersion": "1.3",
                    "cipherSuites": "",
                    "rejectUnknownSni": false,
                    "certificates": [
                        {
                            "certificateFile": CERTIFICATES.defaultCert(domain()),
                            "keyFile": CERTIFICATES.defaultKey(domain()),
                            "ocspStapling": 3600
                        }
                    ],
                    "alpn": [
                        "http/1.1",
                        "h2"
                    ],
                    "settings": {
                        "allowInsecure": false,
                        "fingerprint": "",
                        "serverName": sni,
                        "domains": []
                    }
                },
                "tcpSettings": {
                    "acceptProxyProtocol": false,
                    "header": {
                        "type": "none"
                    }
                }
            }
        }
    }
}

const ToReadableUnits = (bytes: number) => {
    const GB = bytes / (1024 * 1024 * 1024);
    return GB.toFixed(2) + ' GB'
}

const FetchInbounds = async (vps_id: number) => {
    const { api } = SERVER_CONFIG[vps_id]

    const ports: number[] = []
    const emails: string[] = []
    const uuids: string[] = []
    const subids: string[] = []

    const response = await got(`${ api }/panel/api/inbounds/list`, {
        headers: {
            'Accept': 'application/json',
            'Cookie': `session=${ SessionToken.session[vps_id] }`
        }
    }).json<TListResponse>();

    for (const { port, settings } of response.obj) {
        const { clients } = JSON.parse(settings as string) as TListResponseSetting
        ports.push(port)
        for (const { email, id, subId } of clients) {
            emails.push(email)
            uuids.push(id)
            subids.push(subId)
        } 
    }

    return {
        ports: ports,
        emails: emails,
        uuids: uuids,
        subids: subids
    }
}

const newClient = async (
    isTrial: boolean,
    uuid: string,
    email: string,
    subId: string,
    vps_id: number
) => {
    const { api, domain } = SERVER_CONFIG[vps_id]
    const settings = {
        "clients": [
            {
                "id": uuid,
                "flow": "",
                "email": email,
                "limitIp": 0,
                "totalGB": isTrial ? 10737418240 : 0,
                "expiryTime": isTrial ? FutureTimeStamp(1) : FutureTimeStamp(30),
                "enable": true,
                "tgId": "",
                "subId": subId
            }
        ]
    }

    const response = await got.post(`${ api }/panel/api/inbounds/addClient`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': `session=${ SessionToken.session[vps_id] }`
        },
        json: {
            'id': 1,
            'settings': JSON.stringify(settings)
        }
    }).json<{ success: boolean, msg: string, obj: null }>()

    if (response.success) {
        return {
            ID: 1,
            email: email,
            expire: isTrial ? FutureTimeStamp(1) : FutureTimeStamp(30),
            export: `vless://${ uuid }@${ domain() }:443?type=tcp&security=tls&fp=&alpn=http%2F1.1%2Ch2&sni=zoom.us#Dzoom-${ email }`
        }
    }

    return false
}

const newInbound = async (
    config: {
        remark: string,
        vps_id: number,
        method: 'vless' | 'vmess',
        stream_method: 'ws' | 'tls'
        sni: string
    },
    isTrial: boolean,
    port: number,
    uuid: string,
    email: string,
    subId: string,
) => {
    const { remark, vps_id, method, sni, stream_method } = config
    const { api, domain } = SERVER_CONFIG[vps_id]

    const settings = {
        "clients": [
            {
                "id": uuid,
                "email": email,
                "limitIp": 0,
                "totalGB": 0,
                "expiryTime": 0,
                "enable": true,
                "tgId": "",
                "subId": subId
            }
        ]
    }
    
    const sniffing = {
        "enabled": true,
        "destOverride": [
            "http",
            "tls",
            "quic",
            "fakedns"
        ]
    }

    const response = await got.post(`${ api }/panel/api/inbounds/add`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': `session=${ SessionToken.session[vps_id] }`
        },
        json: {
            'enable': true,
            'remark': remark,
            'listen': '',
            'port': port,
            'protocol': method,
            'total': isTrial ? 10737418240 : 0,
            'expiryTime': isTrial ? FutureTimeStamp(1) : FutureTimeStamp(30),
            'settings': JSON.stringify(settings),
            'streamSettings': JSON.stringify(GetStreamSettings(stream_method, domain, sni)),
            'sniffing': JSON.stringify(sniffing)
        }
    }).json<TResponse>();

    if (response.success) {
        return ParseInboundResponse(response, vps_id)
    }

    DevelopmentLog(JSON.stringify(response), true)
    return false
}

export const NewTrial = async (user: User, vps_id: number, method: 'vless' | 'vmess', sni: string, stream_method: 'ws' | 'tls') => {
    /* Check if the Session token is Expired */
    await RefreshSession(vps_id)

    const [ trialStatus, { ports, uuids, emails, subids }] = await Promise.all([
        isTrialExpired(user),
        FetchInbounds(vps_id)
    ])

    if (!trialStatus) {
        const { port, uuid, email, subId } = GenerateInboundFillData(ports, emails, uuids, subids)
        
        if (vps_id === 1 && method === 'vless') {
            return await newClient(true, uuid, `${ user.username }_${ email }`, subId, vps_id)
        }

        return await newInbound({
            remark: user.username,
            vps_id: vps_id,
            method: method,
            sni: sni,
            stream_method: stream_method
        }, true, port, uuid, email, subId)
    }

    return false
}

export const InboundStatus = async (user: User) => {
    const ticket = await FetchTicket(user)
    if (ticket && ticket.inboundID && ticket.vps_id) {
        /* Check if the Session token is Expired */
        await RefreshSession(ticket.vps_id)
        try {
            const { api } = SERVER_CONFIG[ticket.vps_id]
            const url = ticket.email ? `${ api }/panel/api/inbounds/getClientTraffics/${ ticket.email as string }` : `${ api }/panel/api/inbounds/get/${ ticket.inboundID }`
            const { obj: { up, down, total, enable, expiryTime } } = await got(url, {
                headers: {
                    'Accept': 'application/json',
                    'Cookie': `session=${ SessionToken.session[ticket.vps_id] }`
                }
            }).json<TResponse>();
    
            return {
                status: enable,
                timeLeft: enable ? CompareUnixTime(expiryTime) : '00:00:00',
                usage: {
                    allowed: total === 0 ? 'Unlimited' : ToReadableUnits(total),
                    used: {
                        total: ToReadableUnits(up + down),
                        upload: ToReadableUnits(up),
                        download: ToReadableUnits(down)
                    }
                }
            }
        } catch (error) {
            return false
        }
    }
    
    return false
}
