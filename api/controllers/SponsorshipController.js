import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'
import GloabalConfig from '../models/GlobalConfigModel.js'
import RoleEnum from '../enum/RoleEnum.js'
import { ObjectId } from 'mongodb';

export const listSponsorships = async (req, res) => {
  
  const { actor_id } = req.headers
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }
    
    const sponsorships = await Trip.aggregate(      
      [
        {
          $unwind: "$sponsorships"
        }, {
          $match: {
            "sponsorships.sponsor": actor._id
          }
        }, {
          $project: {
            _id: "$sponsorships._id", 
            sponsor: "$sponsorships.sponsor", 
            banner: "$sponsorships.banner", 
            link: "$sponsorships.link", 
            paidAt: "$sponsorships.paidAt",
            financedAmount: "$sponsorships.financedAmount",
            trip: {
              _id: "$_id", 
              ticker: "$ticker", 
              title: "$title", 
              description: "$description"
            }
          }
        }
      ]
    )

    res.json(sponsorships)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const listSponsorshipsAuth= async (req, res) => {  
  try {
    const sponsorships = await Trip.aggregate(      
      [
        {
          $unwind: "$sponsorships"
        }, {
          $match: {
            "sponsorships.sponsor": req.actor._id
          }
        }, {
          $project: {
            _id: "$sponsorships._id", 
            sponsor: "$sponsorships.sponsor", 
            banner: "$sponsorships.banner", 
            link: "$sponsorships.link", 
            paidAt: "$sponsorships.paidAt",
            financedAmount: "$sponsorships.financedAmount",
            trip: {
              _id: "$_id", 
              ticker: "$ticker", 
              title: "$title", 
              description: "$description"
            }
          }
        }
      ]
    )

    res.json(sponsorships)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const createSponsorship = async (req, res) => {
  
  const { actor_id } = req.headers
  const { tripId, banner, link } = req.body
  try {
    const actor = await Actor.findById(actor_id)
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

export const createSponsorshipAuth = async (req, res) => {
  const { tripId, banner, link } = req.body
  try {
    const trip = await Trip.findById(tripId)
    if (!trip) {
      res.status(404).send('Trip not found')
      return
    }
    const newSponsorship = { sponsor: req.actor._id, banner, link }
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

export const readSponsorship = async (req, res) => {
  const { id } = req.params
  try {
    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id)
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        financedAmount: "$sponsorships.financedAmount",
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

export const updateSponsorship = async (req, res) => {
  
  const { id } = req.params
  const { actor_id } = req.headers
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": actor._id
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

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const newSponsorship = { ...sponsorship, ...req.body }
    const prevSponsorships = trip.sponsorships.filter(s => s._id.toString() !== sponsorship._id.toString())
    const newSponsorships = [ ...prevSponsorships, newSponsorship ]

    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const updateSponsorshipAuth = async (req, res) => {
  
  const { id } = req.params
  try {
    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": req.actor._id
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

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const newSponsorship = { ...sponsorship, ...req.body }
    const prevSponsorships = trip.sponsorships.filter(s => s._id.toString() !== sponsorship._id.toString())
    const newSponsorships = [ ...prevSponsorships, newSponsorship ]

    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const paySponsorship = async (req, res) => {
  
  const { id } = req.params
  const { actor_id } = req.headers
  let { financedAmount } = req.body
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": actor._id
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        financedAmount: "$sponsorships.financedAmount",
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    sponsorship.paidAt = new Date()
    if (!financedAmount) {
      const config = await GloabalConfig.findOne()
      financedAmount = config?.sponsorshipFlatRate || 0.1
    }
    sponsorship.financedAmount = financedAmount
    const prevSponsorships = trip.sponsorships.filter(s => s._id.toString() !== sponsorship._id.toString())
    const newSponsorships = [ ...prevSponsorships, sponsorship ]
    
    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const paySponsorshipAuth = async (req, res) => {
  
  const { id } = req.params
  let { financedAmount } = req.body
  try {
    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": req.actor._id
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        financedAmount: "$sponsorships.financedAmount",
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    sponsorship.paidAt = new Date()
    if (!financedAmount) {
      const config = await GloabalConfig.findOne()
      financedAmount = config?.sponsorshipFlatRate || 0.1
    }
    sponsorship.financedAmount = financedAmount
    const prevSponsorships = trip.sponsorships.filter(s => s._id.toString() !== sponsorship._id.toString())
    const newSponsorships = [ ...prevSponsorships, sponsorship ]
    
    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json(updatedTrip)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const deleteSponsorship = async (req, res) => {
  
  const { id } = req.params
  const { actor_id } = req.headers
  try {
    const actor = await Actor.findById(actor_id)
    if (!actor) {
      res.status(404).send('Actor not found')
      return
    }
    if (actor.role !== RoleEnum.SPONSOR) {
      res.status(403).send('Actor does not have the required role')
      return
    }

    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": actor._id
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        financedAmount: "$sponsorships.financedAmount",
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const newSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip.ticker })
  } catch (err) {
    res.status(500).send(err)
  }
}

export const deleteSponsorshipAuth = async (req, res) => {
  
  const { id } = req.params
  try {
    const sponsorships = await Trip.aggregate([
      { $unwind: "$sponsorships" },
      { $match: {
        "sponsorships._id": ObjectId(id),
        "sponsorships.sponsor": req.actor._id
      }},
      { $project: {
        _id: "$sponsorships._id",
        sponsor: "$sponsorships.sponsor",
        banner: "$sponsorships.banner",
        link: "$sponsorships.link",
        paidAt: "$sponsorships.paidAt",
        financedAmount: "$sponsorships.financedAmount",
        tripId: "$_id"
      }}
    ])
    if (!sponsorships.length) {
      res.status(404).send('Sponsorship not found')
      return
    }

    const { tripId, ...sponsorship } = sponsorships[0]
    if (sponsorship.paidAt) {
      res.status(422).send('The sponsorship has already been payed, you can not modify it')
      return
    }
    const trip = await Trip.findById(tripId)
    if (!trip) { throw new Error('Sponsorship associated with no trip') }

    const newSponsorships = [ ...trip.sponsorships ].filter(s => s._id !== sponsorship._id)
    const updatedTrip = await Trip.findOneAndUpdate({ _id: ObjectId(tripId) }, { $set: {"sponsorships": newSponsorships }}, { new: true })
    res.json({ message: 'Sponsorship successfully deleted from trip ' + updatedTrip.ticker })
  } catch (err) {
    res.status(500).send(err)
  }
}
