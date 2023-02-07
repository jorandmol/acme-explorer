import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import initMongoDBConnection from './api/config/mongoose.js'
import applicationRoutes from './api/routes/ApplicationRoutes.js'
import tripRoutes from './api/routes/TripRoutes.js'
import actorRoutes from './api/routes/ActorRoutes.js'
import configRoutes from './api/routes/ConfigRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// welcome route
app.get('/', function (req, res) {
    res.send('Welcome to ACME-Explorer RESTful API')
})

applicationRoutes(app)
tripRoutes(app)
actorRoutes(app)
configRoutes(app)

try {
  await initMongoDBConnection()
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
} catch(err){
  console.error('ACME-Explorer RESTful API could not connect to DB ' + err)
}
