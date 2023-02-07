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
  const { id } = req.params
  const newApplication = req.body
  try {
    const application = await Application.findById(id)
    if (!application) {
      res.status(404).send('Application not found')
      return
    }
    if (application.status === 'cancelled' && application.cancellationDate) {
      res.status(422).send('The application has been cancelled, you can not modify it')
      return
    }
    if (newApplication.status === 'cancelled') {
      if (!newApplication.cancellationReason) {
        res.status(422).send('If you want to cancel the application, you must set a cancellation reason')
        return
      }
      newApplication.cancellationDate = new Date()
    }
    const updatedApplication =  await Application.findOneAndUpdate({ _id: id }, newApplication, { new: true })
    res.json(updatedApplication)
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