export {}

// Type declerations for process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development',
            PORT: number,
            PANEL_USERNAME: string,
            PANEL_PASSWORD: string,
            DISCORD_TOKEN: string,
            GUILD_ID: string,
            CONNECTION_URI: string,
            npm_package_version: string,
        }
    }
}
