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

    const newSponsorship = { sponsor, banner, link }
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
        tripId: "$_id"
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

// TODO: check if the sponsor logged in is the sponsorship creator
const updateSponsorship = async (req, res) => {
  const { id } = req.params
  const newSponsorship = req.body
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
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const sponsorship = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = Trip.findById(sponsorship.tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const prevSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const newSponsorships = [ ...prevSponsorships, newSponsorship ]
    const updatedTrip = await Trip.findOneAndUpdate({ _id: sponsorship.tripId }, { $set: {"sponsorships.$": newSponsorships }}, { new: true })
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip._id })
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: check if the sponsor logged in is the sponsorship creator
const paySponsorship = async (req, res) => {
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
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const sponsorship = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed')
      return
    }
    const trip = Trip.findById(sponsorship.tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    sponsorship.paidAt = new Date()
    const prevSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const newSponsorships = [ ...prevSponsorships, sponsorship ]
    const updatedTrip = await Trip.findOneAndUpdate({ _id: sponsorship.tripId }, { $set: {"sponsorships.$": newSponsorships }}, { new: true })
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip._id })
  } catch (err) {
    res.status(500).send(err)
  }
}

// TODO: check if the sponsor logged in is the sponsorship creator
const deleteSponsorship = async (req, res) => {
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
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const sponsorship = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not delete it')
      return
    }
    const trip = Trip.findById(sponsorship.tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const newSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const updatedTrip = await Trip.findOneAndUpdate({ _id: sponsorship.tripId }, { $set: {"sponsorships.$": newSponsorships }}, { new: true })
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip._id })
  } catch (err) {
    res.status(500).send(err)
  }
}

export { createSponsorship, readSponsorship, updateSponsorship, paySponsorship, deleteSponsorship}