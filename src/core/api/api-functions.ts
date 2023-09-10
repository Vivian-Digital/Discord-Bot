import { TResponse, TSettings, TStreamSettings } from 'panel/API';
import { SERVER_CONFIG } from '../../config/settings.js';

const HexUUID = (stringArray: string[]): string => {
    const characters = "0123456789abcdef"
    const sections = [ 8, 4, 4, 4, 12 ]

    let uuid = "";

    for (let i = 0; i < sections.length; i ++) {
        for (let j = 0; j < sections[i]; j ++) {
            uuid += characters[Math.floor(Math.random() * characters.length)];
        }

        if (i < sections.length - 1) {
            uuid += "-"
        }
    }

    if (stringArray.includes(uuid)) {
        return HexUUID(stringArray)
    }

    return uuid
}

const RandomString = (length: number, stringArray: string[]): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = '';

    for (let i = 0; i < length; i ++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    if (stringArray.includes(randomString)) {
        return RandomString(length, stringArray)
    }

    return randomString;
}

const RandomNumber = (length: number, numberArray: number[]): number => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    if (numberArray.includes(number)) {
        return RandomNumber(length, numberArray)
    }
    
    return number
}

export const FutureTimeStamp = (days: number) => {
    // Get the current timestamp
    const currentTimestamp = Date.now();
    // Number of milliseconds in a day
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    // Calculate the new timestamp
    const newTimestamp = currentTimestamp + (days * millisecondsInDay);

    return newTimestamp
}

export const ParseInboundResponse = (response: TResponse, vps_id: number) => {
    const { domain } = SERVER_CONFIG[vps_id]
    response.obj.settings = JSON.parse(response.obj.settings as string) as TSettings
    response.obj.streamSettings = JSON.parse(response.obj.streamSettings as string) as TStreamSettings
    const { id, remark, protocol, expiryTime, settings: { clients }, port, streamSettings: { network } } = response.obj
    
    switch (protocol) {
        case 'vless': {
            const { streamSettings: { tlsSettings: { alpn }, security } } = response.obj
            return {
                ID: id,
                email: false,
                expire: expiryTime,
                export: `${ protocol }://${ clients[0].id }@${ domain() }:${ port }?type=${ network }&security=${ security }&fp=&alpn=${ encodeURIComponent(alpn.join()) }#${ `${ remark }-${ clients[0].email }` }`
            }
        }
        case 'vmess' : {
            const export_object = {
                "v": "2",
                "ps": `${ remark }-${ clients[0].email }`,
                "add": domain(),
                "port": port,
                "id": clients[0].id,
                "net": network,
                "type": "none",
                "tls": "none",
                "path": "/"
            }

            return {
                ID: id,
                email: false,
                expire: expiryTime,
                export: `${ protocol }://${ btoa(JSON.stringify(export_object)) }`
            }
        }
    }
}

export const GenerateInboundFillData = (
    ports: number[],
    emails: string[],
    uuids: string[],
    subids: string[]
) => {
    return {
        port: RandomNumber(5, ports),
        email: RandomString(8, emails),
        uuid: HexUUID(uuids),
        subId: RandomString(16, subids)
    }
}

export const CompareUnixTime = (expireTime: number) => {
    // Get the current timestamp in milliseconds
    const currentTimestamp = Date.now();
    // Calculate the time difference in milliseconds
    const timeDifferenceInMilliseconds = expireTime - currentTimestamp;
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(timeDifferenceInMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((timeDifferenceInMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((timeDifferenceInMilliseconds % 60000) / 1000); // 1 second = 1000 milliseconds

    return `${ hours }:${ minutes }:${ seconds }` as const
}
