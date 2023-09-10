export {}

// Type declerations for process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development',
            PORT: number,
            DISCORD_TOKEN: string,
            GUILD_ID: string,
            CONNECTION_URI: string,
            npm_package_version: string,
            /* vps credentials */
            [key: `VPS${ number }_API`]: `https://${ string }.netchlk.org:${ number }`,
            [key: `VPS${ number }_USERNAME`]: string,
            [key: `VPS${ number }_PASSWORD`]: string,
            ZOOM_VPS_API: `https://${ string }.netchlk.org:${ number }`,
            ZOOM_VPS_USERNAME: string,
            ZOOM_VPS_PASSWORD: string
        }
    }
}
