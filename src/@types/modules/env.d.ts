export {}

// Type declerations for process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development',
            DISCORD_TOKEN: string,
            GUILD_ID: string,
            npm_package_version: string,
        }
    }
}
