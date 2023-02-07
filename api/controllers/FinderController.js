import Finder from '../models/FinderModel.js'

const listFinders = async (req, res) => {
  const filters = {}
  try {
    const finders = await Finder.find(filters)
    res.json(finders)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createFinder = async (req, res) => {
  const newFinder = new Finder(req.body)
  try{
    const finder = await newFinder.save()
    res.json(finder)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readFinder = async (req, res) => {
  try{
    const finder = await Finder.findById(req.params.id)
    if (finder) {
      res.json(finder)
    } else{
      res.status(404).send('Finder not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const updateFinder = async (req, res) => {
  const newFinder = req.body
  try {
    const finder = await Finder.findOneAndUpdate({ _id: req.params.id }, newFinder, { new:true })
    if (finder) {
      res.json(finder)
    } else{
      res.status(404).send('Finder not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteFinder = async (req, res) => {
  try {
    const deletionResponse = await Finder.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Finder successfully deleted' })
    } else {
      res.status(404).send('Finder could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export {listFinders, createFinder, readFinder, updateFinder, deleteFinder}