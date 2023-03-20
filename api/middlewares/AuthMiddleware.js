import Actor from '../models/ActorModel.js'
import admin from 'firebase-admin';

export const verifyUser = function (requiredRoles) {
  return function (req, res, next) {
    console.log('starting verifying idToken')
    console.log('requiredRoles: ' + requiredRoles)
    const idToken = req.headers.idtoken
    console.log('idToken: ' + idToken)

    admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
      console.log('entra en el then de verifyIdToken: ')

      const uid = decodedToken.uid
      const authTime = decodedToken.auth_time
      const exp = decodedToken.exp
      console.log('idToken verificado para el uid: ' + uid)
      console.log('auth_time: ' + authTime)
      console.log('exp: ' + exp)

      Actor.findOne({ email: uid }, function (err, actor) {
        if (err) {
          res.status(500)
          res.send(err)
        } else if (!actor) { // No actor found with that email
          res.status(401)
          res.json({ message: 'No actor found with the provided email', error: err })
        } else if (!requiredRoles.includes(actor.role)) {
          res.status(403)
          res.json({ message: 'Insufficient roles', error: err })
        } else {
          console.log('The actor exists in our DB')
          console.log('actor: ' + actor)
          req.actor = actor
          next()
        }
      })
    }).catch(function (err) {
      // Handle error
      console.log('Error en autenticación: ' + err)
      res.status(500)
      res.json({ message: 'Error in user authentication', error: err })
    })
  }
}