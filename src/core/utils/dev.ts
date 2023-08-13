import { ENV } from '../../config/config.js'

/* Development Log (Only works Under development ENV) */
export const DevelopmentLog = (log: string): void => {
    if (ENV.NODE_ENV === 'development') {
        console.log(log)
    }
}
