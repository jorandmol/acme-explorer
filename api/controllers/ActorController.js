import Actor from '../models/ActorModel.js'
import Trip from '../models/TripModel.js'
import Application from '../models/ApplicationModel.js'
import RoleEnum from '../enum/RoleEnum.js'
import mongoose from 'mongoose'

const listActors = async (req, res) => {
  const filters = {}
  try {
    const actors = await Actor.find(filters)
    res.json(actors)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createActor = async (req, res) => {
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

const readActor = async (req, res) => {
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

const updateActor = async (req, res) => {
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

const deleteActor = async (req, res) => {
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

const banActor = async (req, res) => {
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

const unbanActor = async (req, res) => {
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

const getManagerTrips = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      if (actor.role === RoleEnum.MANAGER) {
        const trips = await Trip.find({ creator: actor._id })
        res.json(trips)
      } else {
        res.status(403).send('Actor is not a manager')
      }
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const getManagerApplications = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      if (actor.role === RoleEnum.MANAGER) {
        const applications = await Application.find({ trip: { creator: actor._id } })
        res.json(applications)
      } else {
        res.status(403).send('Actor is not a manager')
      }
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const getExplorerApplications = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      if (actor.role === RoleEnum.EXPLORER) {
        const applications = await Application.aggregate([
          { $match: { explorer: new mongoose.Types.ObjectId(actor._id) } },
          { $group: { _id: "$status", applications: { $push: "$$ROOT" } } }
        ]);
        res.json(applications)
      } else {
        res.status(403).send('Actor is not an explorer')
      }
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const listSponsorSponsorships = async (req, res) => {
  const { id } = req.params
  try {
    const sponshorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships.sponsor": id 
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt"
      }}
    ])

    res.json(sponshorships)
  } catch (err) {
    res.status(500).send(err)
  }
}



export {listActors, createActor, readActor, updateActor, deleteActor, banActor, unbanActor, getManagerTrips, getManagerApplications, getExplorerApplications, listSponsorSponsorships}
