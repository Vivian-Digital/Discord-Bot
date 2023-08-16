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
}

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
    ],
    /* Ticket Channel ID */
    TICKET_CHANNEL_ID: "1061538251342626880"
}
