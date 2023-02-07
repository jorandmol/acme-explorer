import Application from '../models/ApplicationModel.js'

const listApplications = async (req, res) => {
  const filters = {}
  try {
    const applications = await Application.find(filters)
    res.json(applications)
  } catch (err) {
    res.status(500).send(err)
  }
}

const createApplication = async (req, res) => {
  const newApplication = new Application(req.body)
  try{
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

const readApplication = async (req, res) => {
  try{
    const application = await Application.findById(req.params.id)
    if (application) {
      res.json(application)
    } else{
      res.status(404).send('Application not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const updateApplication = async (req, res) => {
  const newApplication = req.body
  try {
    const application = await Application.findOneAndUpdate({ _id: req.params.id }, newApplication, { new:true })
    if (application) {
      res.json(application)
    } else{
      res.status(404).send('Application not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const deleteApplication = async (req, res) => {
  try {
    const deletionResponse = await Application.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Application successfully deleted' })
    } else {
      res.status(404).send('Application could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export {listApplications, createApplication, readApplication, updateApplication, deleteApplication}