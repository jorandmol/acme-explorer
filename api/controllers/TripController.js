import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'
import Application from '../models/ApplicationModel.js'
import StatusEnum from '../enum/StatusEnum.js'
import RoleEnum from '../enum/RoleEnum.js'

const _generateFilter = (filters) => {
  const { keyword, minPrice, maxPrice, minDate, maxDate } = filters
  let filter = {}
  if (keyword) {
    filter = { $text: { $search: keyword }}
  }
  if (minPrice) {
    filter = { ...filter, price: { $gte: parseFloat(minPrice) } }
  }
  if (maxPrice) {
    filter = { ...filter, price: { $lte: parseFloat(maxPrice) } }
  }
  if (minDate) {
    filter = { ...filter, startDate: { $gte: minDate } }
  }
  if (maxDate) {
    filter = { ...filter, endDate: { $lte: maxDate } }
  }

  return filter
}

export const searchTrips = async (req, res) => {
  const filters = _generateFilter(req.query)
  try {
    const trips = await Trip.find(filters)
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const listTrips = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.MANAGER) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trips = await Trip.find({ creator: actorId })
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createTrip = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const newTrip = new Trip(req.body)
  try {
    const actor = await Actor.findById(actorId)
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

export const readTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
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
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  const newTrip = req.body
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
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
    const updatedTrip = await Trip.findOneAndUpdate({ _id: id }, newTrip, { new: true })
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
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
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
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  const { publicationDate } = req.body
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.publicationDate) {
      res.status(422).send('The trip has already been published')
      return
    }

    trip.publicationDate = publicationDate
    const updatedTrip = await Trip.findOneAndUpdate({ _id: id }, trip, { new: true })
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
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  const { cancellationReason } = req.body
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }
    if (trip.cancellationDate) {
      res.status(422).send('The trip has already been cancelled')
      return
    }
    if (trip.publicationDate != null) {
      res.status(422).send('The trip is not published yet')
      return
    }
    const apps = await Application.find({ 'trip': trip._id, 'status': StatusEnum.ACCEPTED })
    if (apps.length > 0) {
      res.status(422).send('The trip has accepted applications, you can not cancel it')
      return
    }

    trip.cancellationDate = new Date()
    trip.cancellationReason = cancellationReason
    const updatedTrip = await Trip.findOneAndUpdate({ _id: id }, trip, { new: true })
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
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }

    const applications = await Application.find({ trip: trip._id })
    res.json(applications)
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: check user logged is explorer and append to the newApplication
export const createTripApplication = async (req, res) => {
  const { id } = req.params
  const newApplication = new Application(req.body)
  try {
    const trip = await Trip.findById(id)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }

    newApplication.trip = trip._id
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

export const createTripSponsorship = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  const newSponsorship = req.body
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }

    trip.sponsorships = [...trip.sponsorships, newSponsorship]
    const updatedTrip = await Trip.findOneAndUpdate({ _id: id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const updateTripSponsorships = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { id } = req.params
  const { sponsorships } = req.body
  try {
    const actor = await Actor.findById(actorId)
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
    if (trip.creator !== actor._id) {
      res.status(403).send('Actor does not have the required permissions')
      return
    }

    trip.sponsorships = sponsorships
    const updatedTrip = await Trip.findOneAndUpdate({ _id: id }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}
