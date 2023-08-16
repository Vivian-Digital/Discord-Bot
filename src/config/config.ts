import 'dotenv/config'

export const ENV = {
    /* Node Environment */
    NODE_ENV: process.env.NODE_ENV,
    /* Discord Bot Token */
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    /* Discord Server & Client */
    GUILD_ID: process.env.GUILD_ID,
}

/* Discord bot Runtime Config */
export const CONFIG = {
    devAccounts: [
        "784060192836681749"
    ],
    authorizedAccounts: [
        "784060192836681749"
    ]
}
