import Application from '../models/ApplicationModel.js'
import StatusEnum from '../enum/StatusEnum.js'

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
  try {
    if (await Application.alreadyExists(newApplication.explorer, newApplication.trip)) {
      res.status(409).send('Application already exists')
      return
    }
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

const readApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (application) {
      res.json(application)
    } else {
      res.status(404).send('Application not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const cancelApplication = async (req, res) => {
  // pending, due o accepted y trip no started
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (application) {
      if (application.status === StatusEnum.PENDING || application.status === StatusEnum.DUE || application.status === StatusEnum.ACCEPTED) {
        application.status = StatusEnum.CANCELLED;
        application.cancellationDate = new Date();
        const updatedApplication = await application.save();
        res.send(updatedApplication);
      } else {
        res.status(422).send({ message: "Application status is " + application.status.toUpperCase() + ", it must be PENDING, DUE or ACCEPTED" });
      }
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
};

const acceptApplication = async (req, res) => {
  // pending y trip no started
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (application) {
      if (application.status === StatusEnum.PENDING) {
        application.status = StatusEnum.DUE;
        const updatedApplication = await application.save();
        res.send(updatedApplication);
      } else {
        res.status(422).send({ message: "Application status is " + application.status.toUpperCase() + ", it must be PENDING" });
      }
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
};

const rejectApplication = async (req, res) => {
  // pending y trip no started
  const { id } = req.params;
  const { rejectionReason } = req.body;
  try {
    const application = await Application.findById(id);
    if (application) {
      if (application.status === StatusEnum.PENDING) {
        application.status = StatusEnum.REJECTED;
        application.rejectionReason = rejectionReason;
        const updatedApplication = await application.save();
        res.send(updatedApplication);
      } else {
        res.status(422).send({ message: "Application status is " + application.status.toUpperCase() + ", it must be PENDING" });
      }
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
};

const payApplication = async (req, res) => {
  // due y trip no started
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (application) {
      if (application.status === StatusEnum.DUE) {
        application.status = StatusEnum.ACCEPTED;
        application.paidAt = new Date();
        const updatedApplication = await application.save();
        res.send(updatedApplication);
      } else {
        res.status(422).send({ message: "Application status is " + application.status.toUpperCase() + ", it must be DUE" });
      }
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
};

const updateApplicationComments = async (req, res) => {
  // pending y trip no started
  const { id } = req.params
  const { comments } = req.body
  try {
    const application = await Application.findById(id)
    if (application) {
      if (application.status === StatusEnum.PENDING) {
        application.comments = comments
        const updatedApplication = await application.save();
        res.send(updatedApplication);
      } else {
        res.status(422).send({ message: "Application status is " + application.status.toUpperCase() + ", it must be PENDING" });
      }
    } else {
      res.status(404).send({ message: "Application Not Found" });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export { listApplications, createApplication, readApplication, cancelApplication, acceptApplication, rejectApplication, payApplication, updateApplicationComments }