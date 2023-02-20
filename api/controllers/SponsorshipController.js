import Trip from '../models/TripModel.js'
import { ObjectId } from 'mongodb'

const createSponsorship = async (req, res) => {
  // The sponsor id comes from the logged user
  const sponsor = new ObjectId('63e144632ba413df4fa0d9b6')
  const { tripId, banner, link } = req.body
  try {
    const trip = await Trip.findById(tripId)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }

    const newSponsorship = { sponsor,banner, link }
    trip.sponsorships = [ ...trip.sponsorships, newSponsorship ] 
    const updatedTrip = await Trip.findOneAndUpdate({ _id: tripId }, trip, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readSponsorship = async (req, res) => {
  const { id } = req.params
  try {
    const sponsorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships._id": id 
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        trip: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
    }

    res.json(sponsorships[0])
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO (Update a lo guarro 😎)
const updateSponsorship = async (req, res) => {
  const { id } = req.params
  const newSponsorship = req.body
}

// TODO (Update a lo guarro 😎)
const paySponsorship = async (req, res) => {
  const { id } = req.params

}

// TODO (Update a lo guarro 😎)
const deleteSponsorship = async (req, res) => {
  const { id } = req.params
  
}

export { createSponsorship, readSponsorship, updateSponsorship, paySponsorship, deleteSponsorship}