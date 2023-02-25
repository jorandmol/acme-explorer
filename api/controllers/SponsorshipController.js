import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'

/*
* TODO:
* Extract the check-actor-sponsorship procedure, which is repeated in all functions
* to a middleware so it's easier to maintain
*/

const listSponsorships = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponshorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships.sponsor": actor._id 
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        trip: {
          _id: "$_id",
          ticker: "$ticker",
          title: "$title",
          description: "$description"
        }
      }}
    ])

    res.json(sponshorships)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createSponsorship = async (req, res) => {
  // TODO: change this when auth is implemented
  const { actorId } = req.headers
  const { tripId, banner, link } = req.body
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const trip = await Trip.findById(tripId)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }

    const newSponsorship = { sponsor: actor._id, banner, link }
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
        trip: {
          _id: "$_id",
          ticker: "$ticker",
          title: "$title",
          description: "$description"
        }
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

const updateSponsorship = async (req, res) => {
  // TODO: change this when auth is implemented
  const { id } = req.params
  const { actorId } = req.headers
  const { banner, link } = req.body
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships._id": id,
        "sponshorships.sponsor": actor._id 
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

    const newSponsorship = { ...sponsorship, banner, link }
    const prevSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const newSponsorships = [ ...prevSponsorships, newSponsorship ]
    const updatedTrip = await Trip.findOneAndUpdate({ _id: sponsorship.tripId }, { $set: {"sponsorships.$": newSponsorships }}, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    res.status(500).send(err)
  }
}

const paySponsorship = async (req, res) => {
  // TODO: change this when auth is implemented
  const { id } = req.params
  const { actorId } = req.headers
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships._id": id,
        "sponshorships.sponsor": actor._id 
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
    res.json(updatedTrip)
  } catch (err) {
    res.status(500).send(err)
  }
}

const deleteSponsorship = async (req, res) => {
  // TODO: change this when auth is implemented
  const { id } = req.params
  const { actorId } = req.headers
  try {
    const actor = await Actor.findById(actorId)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: sponsorships },
      { $match: {
        "sponshorships._id": id,
        "sponshorships.sponsor": actor._id 
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
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip.ticker })
  } catch (err) {
    res.status(500).send(err)
  }
}

export { listSponsorships, createSponsorship, readSponsorship, updateSponsorship, paySponsorship, deleteSponsorship}