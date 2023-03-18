import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'
import Application from '../models/ApplicationModel.js'
import Finder from '../models/FinderModel.js'
import GloabalConfig from '../models/GlobalConfigModel.js'
import StatusEnum from '../enum/StatusEnum.js'
import RoleEnum from '../enum/RoleEnum.js'
import { ObjectId } from 'mongodb';

const _generateFilter = (filters) => {
  const { keyword, minPrice, maxPrice, minDate, maxDate } = filters
  let filter = {}
  if (keyword) {
    filter = { $text: { $search: keyword } }
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

const _getConfig = async () => {
  try {
    const config = await GloabalConfig.findOne()
    return {
      numResults: config?.numResults || 10,
      cacheLifetime: config?.cacheLifetime || 3600
    }
  } catch (err) {
    console.error(err)
    return {
      numResults: 10,
      cacheLifetime: 3600
    }
  }
}

const _isSameFinder = (finder, query) => {
  const { keyword, minPrice, maxPrice, minDate, maxDate } = query
  if (((keyword && finder.keyword === keyword) || (!keyword && finder.keyword === null)) &&
    ((minPrice && finder.minPrice === parseInt(minPrice)) || (!minPrice && finder.minPrice === null)) &&
    ((maxPrice && finder.maxPrice === parseInt(maxPrice)) || (!maxPrice && finder.maxPrice === null)) &&
    ((minDate && Date(finder.minDate) === Date(minDate)) || (!minDate && finder.minDate === null)) &&
    ((maxDate && Date(finder.maxDate) === Date(maxDate)) || (!maxDate && finder.maxDate === null))) {
    return true
  }
  return false
}

const _findTrips = async (actorId, query) => {
  try {
    const filters = _generateFilter(query)
    const config = await _getConfig()
    const trips = await Trip.find(filters).limit(config.limit)
    const newFinder = new Finder({
      explorer: ObjectId(actorId),
      keyword: query?.keyword || null,
      minPrice: query?.minPrice ? parseInt(query.minPrice) : null,
      maxPrice: query?.maxPrice ? parseInt(query.maxPrice) : null,
      minDate: query?.minDate || null,
      maxDate: query?.maxDate || null,
      results: trips,
      expiryDate: new Date(Date.now() + config.cacheLifetime * 1000)
    })
    await newFinder.save()
    return trips
  } catch (err) {
    console.error(err)
  }
}

export const searchTrips = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actor_id } = req.headers
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
    let finder = await Finder.find({ explorer_id: actor_id }).sort("-createdAt").limit(1);
    if (finder?.length) {
      finder = finder[0]
      console.log(finder.expiryDate, new Date())
      if (_isSameFinder(finder, req.query) && finder.expiryDate && finder.expiryDate > new Date()) {
        res.json(finder.results)
        console.log("Cached finder returned")
        return
      } else {
        const trips = await _findTrips(actor_id, req.query)
        res.json(trips)
        console.log("New finder created, old one expired or different")
        return
      }
    } else {
      const trips = await _findTrips(actor_id, req.query)
      res.json(trips)
      console.log("New finder created, no old one found")
      return
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}

export const listTrips = async (req, res) => {
  // TODO: change this when auth is implemented
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

export const createTrip = async (req, res) => {
  // TODO: change this when auth is implemented
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
  } catch (err) {
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
    } else {
      res.status(404).send('Trip not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const updateTrip = async (req, res) => {
  // TODO: change this when auth is implemented
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
      newTrip.price = [...newTrip.stages].map(stage => stage.price).reduce((totalPrice, actualPrice) => totalPrice + actualPrice, 0)
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
  // TODO: change this when auth is implemented
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

export const publishTrip = async (req, res) => {
  // TODO: change this when auth is implemented
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

export const cancelTrip = async (req, res) => {
  // TODO: change this when auth is implemented
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

export const listTripApplications = async (req, res) => {
  // TODO: change this when auth is implemented
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

export const createTripApplication = async (req, res) => {
  // TODO: change this when auth is implemented
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

    const applications = await Application.find({ trip: trip._id })
    const explorerTripApplicantions = applications.filter(app => app.explorer.toString() === actor._id.toString())
    if (explorerTripApplicantions.length) {
      res.status(403).send('There is already another application created by you')
      return
    }

    const newApplication = new Application({ trip: trip._id, explorer: actor._id, comments })
    const application = await newApplication.save()
    res.json(application)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}
