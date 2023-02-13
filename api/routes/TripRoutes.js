import { listTrips, createTrip, readTrip, updateTrip, deleteTrip, addStages, cancelTrip } from '../controllers/TripController.js'
import { creationValidator, updateValidator, stageValidator, cancellationValidator } from '../controllers/validators/TripValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get a trip
  *    Required role: None
  * Post an actor
  *    RequiredRoles: Manager
  *
  * @section trips
  * @type get post
  * @url /v1/trips
  */
  app.route('/v1/trips')
    .get(listTrips)
    .post(
      creationValidator,
      handleExpressValidation,
      createTrip
    )

  /**
  * Put a trip
  *    RequiredRoles: to be manager who created the trip
  * Get a trip
  *    RequiredRoles: None
  *
  * @section trips
  * @type get put
  * @url /v1/trips/:id
  */
  app.route('/v1/trips/:id')
    .get(readTrip)
    .put(
      updateValidator,
      handleExpressValidation,
      updateTrip
    )
    .delete(deleteTrip)

  /**
  * Cancel a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /v1/trips/:id/cancellation
  */
  app.route('/v1/trips/:id/cancellation')
    .patch(
      cancellationValidator,
      handleExpressValidation,
      cancelTrip
  )

  // TODO
  // - Publish trip route (?)

}