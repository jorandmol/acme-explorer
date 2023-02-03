import Trip from '../models/TripModel.js'

const listTrips = async (req, res) => {
  const filters = {}
  try {
    const trips = await Trip.find(filters)
    res.json(trips)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createTrip = async (req, res) => {
  const newTrip = new Trip(req.body)
  try{
    const trip = await newTrip.save()
    res.json(trip)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readTrip = async (req, res) => {
  try{
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

const updateTrip = async (req, res) => {
  const newTrip = req.body
  try {
    const trip = await Trip.findOneAndUpdate({ _id: req.params.id }, newTrip, { new:true })
    if (trip) {
      res.json(trip)
    } else{
      res.status(404).send('Trip not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteTrip = async (req, res) => {
  try {
    const deletionResponse = await Trip.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Trip successfully deleted' })
    } else {
      res.status(404).send('Trip could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export {listTrips, createTrip, readTrip, updateTrip, deleteTrip}