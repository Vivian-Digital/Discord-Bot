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
    /* Ticket Manger */
    MANGER: "784060192836681749",
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
        NEON_BOOKMARK: 'https://img.icons8.com/external-xnimrodx-lineal-gradient-xnimrodx/64/external-bookmark-seo-xnimrodx-lineal-gradient-xnimrodx.png'
    }
} as const
