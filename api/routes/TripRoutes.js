import { searchTrips, listTrips, createTrip, readTrip, updateTrip, deleteTrip, publishTrip, cancelTrip, listTripApplications, createTripApplication } from '../controllers/TripController.js'
import { creationValidator as tripCreationValidator, updateValidator, publishValidator, cancelValidator } from '../controllers/validators/TripValidator.js'
import { creationFromTripValidator as appCreationValidator } from '../controllers/validators/ApplicationValidator.js'
import { filterValidator } from '../controllers/validators/FinderValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {

  /**
  * Get trips by filters
  *    Required role: None
  *
  * @section trips
  * @type get
  * @url /v1/search
  */
  app.route('/v1/search')
    .get(
      filterValidator,
      handleExpressValidation,
      searchTrips
    )

  /**
  * Get manager's trips
  *    Required role: Manager
  * Post a trip
  *    RequiredRoles: Manager
  *
  * @section trips
  * @type get post
  * @url /v1/trips
  */
  app.route('/v1/trips')
    .get(listTrips)
    .post(
      tripCreationValidator,
      handleExpressValidation,
      createTrip
    )

  /**
  * Put a trip
  *    RequiredRoles: to be manager who created the trip
  * Get a trip
  *    RequiredRoles: None
  * Delete a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type get put delete
  * @url /v1/trips/:id
  */
  app.route('/v1/trips/:id')
    .get(readTrip)
    .put(
      updateValidator,
      handleExpressValidation,
      updateTrip
    ).delete(deleteTrip)

  /**
  * Publish a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /v1/trips/:id/publish
  */
  app.route('/v1/trips/:id/publish')
    .patch(
      publishValidator,
      handleExpressValidation,
      publishTrip
    )

  /**
  * Cancel a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /v1/trips/:id/cancel
  */
  app.route('/v1/trips/:id/cancel')
    .patch(
      cancelValidator,
      handleExpressValidation,
      cancelTrip
    )

  /**
  *
  * APPLICATIONS
  *
  */

  /**
  * Get trip's applications
  *    RequiredRoles: to be manager who created the trip
  * Post application
  *    RequiredRoles: Explorer
  *
  * @section trips
  * @type get post
  * @url /v1/trips/:id/applications
  */
  app.route('/v1/trips/:id/applications')
  .get(listTripApplications)
  .post(
    appCreationValidator,
    handleExpressValidation,
    createTripApplication
  )

}