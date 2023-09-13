import 'dotenv/config'

export const PORT = 8080

export const ENV = {
    PORT: process.env.PORT,
    /* Node Environment */
    NODE_ENV: process.env.NODE_ENV,
    /* NPM Package Version */
    NPM_PACKAGE_VERSION: process.env.npm_package_version,
    /* Discord Bot Token */
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    /* Discord Server */
    GUILD_ID: process.env.GUILD_ID,
    /* Mongodb Connection URI */
    CONNECTION_URI: process.env.CONNECTION_URI,
    CREDENTIALS: {
        VPS_1: {
            API: process.env.VPS1_API,
            USERNAME: process.env.VPS1_USERNAME,
            PASSWORD: process.env.VPS1_PASSWORD
        },
        VPS_2: {
            API: process.env.VPS2_API,
            USERNAME: process.env.VPS2_USERNAME,
            PASSWORD: process.env.VPS2_PASSWORD
        },
        VPS_3: {
            API: process.env.VPS3_API,
            USERNAME: process.env.VPS3_USERNAME,
            PASSWORD: process.env.VPS3_PASSWORD
        },
        ZOOM_VPS: {
            API: process.env.ZOOM_VPS_API,
            USERNAME: process.env.ZOOM_VPS_USERNAME,
            PASSWORD: process.env.ZOOM_VPS_PASSWORD
        },
    }
} as const

/* Discord bot Runtime Config */
export const CONFIG = {
    /* Command id Array */
    deleteQueue: [],
    /* Dev Accounts */
    devAccounts: [
        "784060192836681749"
    ],
    /* Authorized Accounts */
    authorizedAccounts: [
        "784060192836681749"
    ]
}

/* Ticket Interaction Configurations */
export const TICKET = {
    /* Ticket Staff Role ID */
    STAFF_ROLE: "1061544410820640788",
    /* Ticket Channel ID */
    CHANNEL_ID: "1141592276284477450",
    /* Ticket Category */
    CATEGORY_ID: "1141671074589855844"
} as const

export const EMBED_DATA = {
    ICONS: {
        GREEN_SHIELD: 'https://i.ibb.co/M55Fj3D/icons8-verified-account.gif',
    },
    THUMBNAILS: {
        NEON_BOOKMARK: 'https://img.icons8.com/external-xnimrodx-lineal-gradient-xnimrodx/64/external-bookmark-seo-xnimrodx-lineal-gradient-xnimrodx.png',
        BLUE_HOST_SERVER: 'https://img.icons8.com/fluency/96/server.png'
    }
} as const

export const BANK_STRING = '```P.P.K Samantha\nPeoples Bank - Hungama\n1234 1234 1234 1234\nLKR 3500/=```'
