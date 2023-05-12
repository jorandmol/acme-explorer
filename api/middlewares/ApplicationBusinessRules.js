import Application from "../models/ApplicationModel.js";
import Trip from "../models/TripModel.js";

export const checkTrip = async (req, res, next) => {
  let tripId = null;

  try {

    if (req.method === "PATCH") {
      const applicationId = req.params.id;
      const application = await Application.findById(applicationId);
      tripId = application.trip;

    } else if (req.method === "POST") {
      tripId = req.body.trip;
    }

    if (tripId) {
      const trip = await Trip.findById(tripId);
      const isCancel = req.path.endsWith("cancel");

      if (!trip) {
        res.status(404).send({ message: "Trip Not Found" });

      } else if (trip && trip.startDate < new Date() && !isCancel) {
        res.status(400).send({ message: "Trip has already started" });

      } else if (trip.cancellationDate && !isCancel) {
        res.status(400).send({ message: "Trip has been cancelled" });

      } else {
        req.trip = trip;
        next();
      }
    } else {
      res.status(404).send({ message: "Trip Not Found" });
    }

  } catch (err) {
    res.status(500).send(err?.message)
  }
}

