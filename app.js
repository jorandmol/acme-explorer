import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import initMongoDBConnection from './api/config/mongoose.js'
import swagger from './swagger.js'
import applicationRoutes from './api/routes/ApplicationRoutes.js'
import tripRoutes from './api/routes/TripRoutes.js'
import actorRoutes from './api/routes/ActorRoutes.js'
import finderRoutes from './api/routes/FinderRoutes.js'
import configRoutes from './api/routes/ConfigRoutes.js'
import loaderRoutes from './api/routes/LoaderRoutes.js'
import sponsorshipRoutes from './api/routes/SponsorshipRoutes.js'
import dataWarehouseRoutes from './api/routes/DataWarehouseRoutes.js'
import { initializeDataWarehouseJob } from "./api/services/DataWarehouseServiceProvider.js";
import admin from 'firebase-admin';

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: Buffer.from(process.env.FIREBASE_PRIVATE_KEY , 'base64').toString('ascii'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  }),
  // databaseURL: 'https://acmeexplorer.firebaseio.com'
})

// welcome route
app.get('/', function (req, res) {
    res.send('Welcome to ACME-Explorer RESTful API')
})

applicationRoutes(app)
tripRoutes(app)
actorRoutes(app)
sponsorshipRoutes(app)
finderRoutes(app)
configRoutes(app)
loaderRoutes(app)
dataWarehouseRoutes(app)

swagger(app)

try {
  await initMongoDBConnection()
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
} catch(err){
  console.error('ACME-Explorer RESTful API could not connect to DB ' + err)
}

initializeDataWarehouseJob();

export default app