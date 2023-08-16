declare namespace Express {
    import { Client } from 'discord.js';
    export interface Request {
        xClient: Client<true> 
    }
}
