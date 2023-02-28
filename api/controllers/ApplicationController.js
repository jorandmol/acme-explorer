import Application from '../models/ApplicationModel.js'
import Actor from '../models/ActorModel.js'
import StatusEnum from '../enum/StatusEnum.js'
import RoleEnum from '../enum/RoleEnum.js'
import mongoose from 'mongoose'

export const listApplications = async (req, res) => {
  try {
    const actor = await Actor.findById(req.headers.actor_id)
    if (actor) {
      if (actor.role === RoleEnum.EXPLORER) {
        const applications = await Application.aggregate([
          { $match: { explorer: new mongoose.Types.ObjectId(actor._id) } },
          { $group: { _id: "$status", applications: { $push: "$$ROOT" } } }
        ]);
        res.json(applications)
      } else {
        res.status(403).send('Actor is not an explorer')
      }
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createApplication = async (req, res) => {
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

export const readApplication = async (req, res) => {
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

export const cancelApplication = async (req, res) => {
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

export const acceptApplication = async (req, res) => {
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

export const rejectApplication = async (req, res) => {
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

export const payApplication = async (req, res) => {
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

export const updateApplicationComments = async (req, res) => {
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
