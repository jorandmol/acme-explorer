import Actor from '../models/ActorModel.js'
import admin from 'firebase-admin';

export const login = async (req, res) => {
  console.log('starting login an actor')
  const { email, password } = req.body
  let customToken

  Actor.findOne({ email: email }, function (err, actor) {
    if (err) { // No actor found with that email as username
      res.send(err)
    } else if (!actor) { // an access token isn’t provided, or is invalid
      res.status(401)
      res.json({ message: 'Forbidden, no actor found', error: err })
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err)
        } else if (!isMatch) { // Password did not match
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'Forbidden, incorrect password', error: err })
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
