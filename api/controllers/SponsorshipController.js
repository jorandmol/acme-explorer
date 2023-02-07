import Sponsorship from '../models/SponsorshipModel.js'

const listSponsorships = async (req, res) => {
  const filters = {}
  try {
    const sponsorships = await Sponsorship.find(filters)
    res.json(sponsorships)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createSponsorship = async (req, res) => {
  const newSponsorship = new Sponsorship(req.body)
  try{
    const sponsorship = await newSponsorship.save()
    res.json(sponsorship)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readSponsorship = async (req, res) => {
  try{
    const sponsorship = await Sponsorship.findById(req.params.id)
    if (sponsorship) {
      res.json(sponsorship)
    } else{
      res.status(404).send('Sponsorship not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const updateSponsorship = async (req, res) => {
  const newSponsorship = req.body
  try {
    const sponsorship = await Sponsorship.findOneAndUpdate({ _id: req.params.id }, newSponsorship, { new:true })
    if (sponsorship) {
      res.json(sponsorship)
    } else{
      res.status(404).send('Sponsorship not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteSponsorship = async (req, res) => {
  try {
    const deletionResponse = await Sponsorship.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Sponsorship successfully deleted' })
    } else {
      res.status(404).send('Sponsorship could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export {listSponsorships, createSponsorship, readSponsorship, updateSponsorship, deleteSponsorship}