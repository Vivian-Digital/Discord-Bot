import express, { Application } from 'express'
import { AddressInfo } from 'net'
import helmet from 'helmet'
import cors from 'cors'

const app: Application = express()

/* Registering Events */
import './core/controllers/channels.js'
import './core/services/connection.js'
import './core/services/SessionToken.js'

import Routes from './routes/base-routes.js'
import { ExpressResponse } from './core/utils/response.js'
import { ENV, PORT } from './config/config.js'
import { ExpressRequest } from './routes/middlewares/express-validate.js'
import { DevelopmentLog } from './core/utils/dev.js'
import { ClientInstance } from './core/client/client.js'
import { AppEvents } from './core/services/emitter.js'

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use((req, res, next) => {
    DevelopmentLog(req.originalUrl)
    /* Expose Discrod Client to Incomming Requests */
    req.xClient = ClientInstance
    next()
})

app.use(ExpressRequest)

app.use('/api', Routes)

app.get('/api', (req, res) => {
    return ExpressResponse(res, true, 200, {
        status: 'OK',
        version: ENV.NPM_PACKAGE_VERSION,
        message: 'server is up and running...'
    })
})

app.use('*', (req, res) => {
    res.sendStatus(403)
})

/* Send Singnal to start client and database */
AppEvents.emit('onReady')

AppEvents.on('Ready', () => {
    /* Start express webserver when bot is ready */
    const server = app.listen(ENV.PORT || PORT, () => {
        const { address, port } = server.address() as AddressInfo
        DevelopmentLog(`(Discord) API running in http://${ address }:${ port }`, true)
    })
})
