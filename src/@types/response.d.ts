declare module 'panel/API' {
    export interface TResponse {
        success: boolean,
        msg: string,
        obj: {
            id: number,
            up: number,
            down: number,
            total: number,
            remark: string,
            enable: true,
            expiryTime: number,
            port: number,
            protocol: 'vless' | 'vmess',
            settings: string | TSettings,
            streamSettings: string | TStreamSettings,
            tag: string,
            sniffing: string
        }
    }

    interface TListResponseSetting {
        clients: [
            {
                "id": string,
                "flow": string,
                "email": string,
                "limitIp": number,
                "totalGB": number,
                "expiryTime": number,
                "enable": boolean,
                "tgId": string,
                "subId": string
            }
        ],
        decryption: "none",
        fallbacks: []
    }

    export interface TListResponse {
        success: boolean,
        msg: string,
        obj: {
            port: number,
            settings: TListResponseSetting | string
        }[]
    }

    export interface TSettings {
        "clients":[
            {
                "id": string,
                "flow":"",
                "email":"css2k222",
                "limitIp":0,
                "totalGB":0,
                "expiryTime":0,
                "enable":true,
                "tgId":"",
                "subId":"y4ty739lkuvxvcik"
            }
        ],
        "decryption":"none",
        "fallbacks": []
    }

    export interface TStreamSettings {
        "network": "tcp" | "ws",
        "security": "tls" | 'none',
        "tlsSettings": {
            "serverName": "",
            "minVersion": "1.2",
            "maxVersion": "1.3",
            "cipherSuites": "",
            "rejectUnknownSni": false,
            "certificates": [
                {
                    "certificateFile": string,
                    "keyFile": string
                }
            ],
            "alpn": ["h2", "http/1.1"],
            "settings": {
                "allowInsecure": false,
                "fingerprint": "",
                "serverName": "m.zoom.us",
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
