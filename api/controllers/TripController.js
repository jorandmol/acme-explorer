import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'
import Application from '../models/ApplicationModel.js'
import GloabalConfig from '../models/GlobalConfigModel.js'
import StatusEnum from '../enum/StatusEnum.js'
import RoleEnum from '../enum/RoleEnum.js'
import { ObjectId } from 'mongodb';

const _generateFilter = (filters) => {
  const { keyword, minPrice, maxPrice, minDate, maxDate } = filters
  let filter = {}
  if (keyword) {
    filter = { $text: { $search: keyword }}
  }
  if (minPrice || maxPrice) {
    const priceFilter = []
    if (minPrice) { priceFilter.push({ price: { $gte: minPrice } }) }
    if (maxPrice) { priceFilter.push({ price: { $lte: maxPrice } }) }
    filter = { ...filter, $and: priceFilter }
  }
  if (minDate) {
    filter = { ...filter, startDate: { $gte: minDate } }
  }
  if (maxDate) {
    filter = { ...filter, endDate: { $lte: maxDate } }
  }

  return filter
}

const _getLimit = async () => {
  try {
    const config = await GloabalConfig.findOne()
    return config?.numResults || 10
  } catch (err) {
    console.error(err)
    return 10
  }
}

export const searchTrips = async (req, res) => {
  const filters = _generateFilter(req.query)
  try {
    const limit = await _getLimit()
    const trips = await Trip.findByFilters(filters, limit)
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const listTrips = async (req, res) => {
  
  const { actor_id } = req.headers
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trips = await Trip.find({ creator: ObjectId(actor_id) })
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const listTripsAuth = async (req, res) => {
  try {
    const trips = await Trip.find({ creator: ObjectId(req.actor._id) })
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createTrip = async (req, res) => {
  
  const { actor_id } = req.headers
  const newTrip = new Trip(req.body)
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    newTrip.creator = actor._id
    const trip = await newTrip.save()
    res.json(trip)
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const createTripAuth = async (req, res) => {
  const newTrip = new Trip(req.body)
  try {
    newTrip.creator = req.actor._id
    const trip = await newTrip.save()
    res.json(trip)
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const readTrip = async (req, res) => {
  const { id } = req.params
  try {
    const trip = await Trip.findById(id)
    if (trip) {
      res.json(trip)
    } else{
      res.status(404).send('Trip not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const updateTrip = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  const newTrip = req.body
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published, you can not modify it')
      return
    }

    if (!newTrip.price) {
      newTrip.price = [ ...newTrip.stages ].map(stage => stage.price).reduce((totalPrice, actualPrice) => totalPrice + actualPrice, 0)
    }

    // Keep dates null
    newTrip.publicationDate = null
    newTrip.cancellationDate = null
    newTrip.cancellationReason = null
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, newTrip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const updateTripAuth = async (req, res) => {
  const { id } = req.params
  const newTrip = req.body
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== req.actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published, you can not modify it')
      return
    }

    if (!newTrip.price) {
      newTrip.price = [ ...newTrip.stages ].map(stage => stage.price).reduce((totalPrice, actualPrice) => totalPrice + actualPrice, 0)
    }

    // Keep dates null
    newTrip.publicationDate = null
    newTrip.cancellationDate = null
    newTrip.cancellationReason = null
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, newTrip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const deleteTrip = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published, you can not delete it')
      return
    }

    const deletionResponse = await Trip.deleteOne({ _id: trip._id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Trip successfully deleted' })
    } else {
      res.status(404).send('Trip could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const deleteTripAuth = async (req, res) => {
  const { id } = req.params
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== req.actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published, you can not delete it')
      return
    }

    const deletionResponse = await Trip.deleteOne({ _id: trip._id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Trip successfully deleted' })
    } else {
      res.status(404).send('Trip could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const publishTrip = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  const { publicationDate } = req.body
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published')
      return
    }

    trip.publicationDate = publicationDate
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const publishTripAuth = async (req, res) => {
  const { id } = req.params
  const { publicationDate } = req.body
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== req.actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published')
      return
    }

    trip.publicationDate = publicationDate
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const cancelTrip = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  const { cancellationReason } = req.body
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.cancellationDate) {
      res.status(422).send('The trip has already been cancelled')
      return
    }
    if (!trip.publicationDate) {
      res.status(422).send('The trip is not published yet')
      return
    }
    const apps = await Application.find({ trip: trip._id, status: StatusEnum.ACCEPTED })
    if (apps.length > 0) {
      res.status(422).send('The trip has accepted applications, you can not cancel it')
      return
    }

    trip.cancellationDate = new Date()
    trip.cancellationReason = cancellationReason
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const cancelTripAuth = async (req, res) => {
  const { id } = req.params
  const { cancellationReason } = req.body
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    if (trip.creator.toString() !== req.actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.cancellationDate) {
      res.status(422).send('The trip has already been cancelled')
      return
    }
    if (!trip.publicationDate) {
      res.status(422).send('The trip is not published yet')
      return
    }
    const apps = await Application.find({ trip: trip._id, status: StatusEnum.ACCEPTED })
    if (apps.length > 0) {
      res.status(422).send('The trip has accepted applications, you can not cancel it')
      return
    }

    trip.cancellationDate = new Date()
    trip.cancellationReason = cancellationReason
    const updatedTrip = await Trip.findOneAndUpdate({ _id: trip._id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const listTripApplications = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }

    const applications = await Application.find({ trip: trip._id })
    res.json(applications)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const listTripApplicationsAuth = async (req, res) => {
  const { id } = req.params
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    
    if (trip.creator.toString() !== req.actor._id.toString()) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }

    const applications = await Application.find({ trip: trip._id })
    res.json(applications)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createTripApplication = async (req, res) => {
  
  const { actor_id } = req.headers
  const { id } = req.params
  const { comments } = req.body
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.EXPLORER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }

    const explorerTripApplications = await Application.find({ trip: trip._id, explorer: actor._id })
    if (explorerTripApplications.length) {
      res.status(409).send('There is already another application created by this user')
      return
    }

    const newApplication = new Application({ trip: trip._id, explorer: actor._id, comments })
    const application = await newApplication.save()
    res.json(application)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const createTripApplicationAuth = async (req, res) => {
  const { id } = req.params
  const { comments } = req.body
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }

    const explorerTripApplications = await Application.find({ trip: trip._id, explorer: req.actor._id })
    if (explorerTripApplications.length) {
      res.status(409).send('There is already another application created by this user')
      return
    }

    const newApplication = new Application({ trip: trip._id, explorer: req.actor._id, comments })
    const application = await newApplication.save()
    res.json(application)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}