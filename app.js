import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import initMongoDBConnection from './api/config/mongoose.js'
import swagger from './swagger.js'
import applicationRoutesV1 from './api/routes/v1/ApplicationRoutes.js'
import tripRoutesV1 from './api/routes/v1/TripRoutes.js'
import actorRoutesV1 from './api/routes/v1/ActorRoutes.js'
import finderRoutesV1 from './api/routes/v1/FinderRoutes.js'
import configRoutesV1 from './api/routes/v1/ConfigRoutes.js'
import loaderRoutesV1 from './api/routes/v1/LoaderRoutes.js'
import sponsorshipRoutesV1 from './api/routes/v1/SponsorshipRoutes.js'
import dataWarehouseRoutesV1 from './api/routes/v1/DataWarehouseRoutes.js'
import loginRoutesV1 from './api/routes/v1/LoginRoutes.js'
import { initializeDataWarehouseJob } from "./api/services/DataWarehouseServiceProvider.js";
import admin from 'firebase-admin';
import serviceAccount from './firebase.json' assert { type: "json" }

dotenv.config()

const app = express()
const port = 8080
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://acmeexplorer.firebaseio.com'
})

// welcome route
app.get('/', function (req, res) {
    res.send('Welcome to ACME-Explorer RESTful API')
})

applicationRoutesV1(app)
tripRoutesV1(app)
actorRoutesV1(app)
sponsorshipRoutesV1(app)
finderRoutesV1(app)
configRoutesV1(app)
loaderRoutesV1(app)
dataWarehouseRoutesV1(app)
loginRoutesV1(app)

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