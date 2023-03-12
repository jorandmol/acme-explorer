import Actor from '../models/ActorModel.js'
import admin from 'firebase-admin';

export const login = async (req, res) => {
  console.log('starting login an actor')
  const emailParam = req.query.email
  const password = req.query.password
  let customToken

  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { // No actor found with that email as username
      res.send(err)
    } else if (!actor) { // an access token isn’t provided, or is invalid
      res.status(401)
      res.json({ message: 'forbidden', error: err })
    } else if ((actor.role.includes('CLERK')) && (actor.validated === false)) { // an access token is valid, but requires more privileges
      res.status(403)
      res.json({ message: 'forbidden', error: err })
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err)
        } else if (!isMatch) { // Password did not match
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err })
        } else {
          try {
            customToken = await admin.auth().createCustomToken(actor.email)
          } catch (error) {
            console.log('Error creating custom token:', error)
          }
          actor.customToken = customToken
          res.json(actor)
        }
      })
    }
  })
}

export const listActors = async (req, res) => {
  const filters = {}
  try {
    const actors = await Actor.find(filters)
    res.json(actors)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createActor = async (req, res) => {
  const newActor = new Actor(req.body)
  try{
    const actor = await newActor.save()
    res.json(actor)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const readActor = async (req, res) => {
  try{
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      res.json(actor)
    } else{
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const updateActor = async (req, res) => {
  const newActor = req.body
  try {
    const actor = await Actor.findOneAndUpdate({ _id: req.params.id }, newActor, { new:true })
    if (actor) {
      res.json(actor)
    } else{
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const updateVerifiedActor = async (req, res) => {
  // Customer and Clerks can update theirselves, administrators can update any actor
  console.log('Starting to update the verified actor...')
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      console.log('actor: ' + actor)
      const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
      if (actor.role.includes('CUSTOMER') || actor.role.includes('CLERK')) {
        const authenticatedUserId = await getUserId(idToken)

        if (authenticatedUserId == req.params.actorId) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
            if (err) {
              res.send(err)
            } else {
              res.json(actor)
            }
          })
        } else {
          res.status(403) // Auth error
          res.send('The Actor is trying to update an Actor that is not himself!')
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
          if (err) {
            res.send(err)
          } else {
            res.json(actor)
          }
        })
      } else {
        res.status(405) // Not allowed
        res.send('The Actor has unidentified roles')
      }
    }
  })
}

export const validateActor = async (req, res) => {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try {
    const actor = await Actor.findOneAndUpdate({ _id: req.params.actorId }, { validated: 'true' }, { new: true })
    if (actor) {
      res.json(actor)
    }
    else {
      res.status(404).send("Actor not found")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export const deleteActor = async (req, res) => {
  try {
    const deletionResponse = await Actor.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Actor successfully deleted' })
    } else {
      res.status(404).send('Actor could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const banActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      actor.ban = req.body
      const updatedActor = await actor.save()
      res.json(updatedActor)
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const unbanActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      actor.ban = undefined
      const updatedActor = await actor.save()
      res.json(updatedActor)
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
