import * as tripsController from '../controllers/TripController.js'
import { creationValidator as tripCreationValidator, updateValidator, publishValidator, cancelValidator } from '../controllers/validators/TripValidator.js'
import { creationFromTripValidator as appCreationValidator } from '../controllers/validators/ApplicationValidator.js'
import { filterValidator } from '../controllers/validators/FinderValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'
import { verifyUser, verifyOptionalUser } from '../middlewares/AuthMiddleware.js'
import RoleEnum from '../enum/RoleEnum.js'

export default function (app) {

  /**
  * Get trips by filters
  *    Required role: None
  *
  * @section trips
  * @type get
  * @url /search
  */
  app.route('/v1/search')
    .get(
      filterValidator,
      handleExpressValidation,
      tripsController.searchTrips
    )
  app.route('/v2/search')
    .get(
      verifyOptionalUser(),
      filterValidator,
      handleExpressValidation,
      tripsController.searchTripsAuth
    )

  /**
  * Get manager's trips
  *    Required role: Manager
  * Post a trip
  *    RequiredRoles: Manager
  *
  * @section trips
  * @type get post
  * @url /trips
  */
  app.route('/v1/trips')
    .get(tripsController.listTrips)
    .post(
      tripCreationValidator,
      handleExpressValidation,
      tripsController.createTrip
    )
  app.route('/v2/trips')
    .get(verifyUser([RoleEnum.MANAGER]), tripsController.listTripsAuth)
    .post(
      verifyUser([RoleEnum.MANAGER]),
      tripCreationValidator,
      handleExpressValidation,
      tripsController.createTripAuth
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
  * @url /trips/:id
  */
  app.route('/v1/trips/:id')
    .get(tripsController.readTrip)
    .put(
      updateValidator,
      handleExpressValidation,
      tripsController.updateTrip
    )
    .delete(tripsController.deleteTrip)
  app.route('/v2/trips/:id')
    .get(tripsController.readTrip)
    .put(
      verifyUser([RoleEnum.MANAGER]),
      updateValidator,
      handleExpressValidation,
      tripsController.updateTripAuth
    )
    .delete(verifyUser([RoleEnum.MANAGER]), tripsController.deleteTripAuth)

  /**
  * Publish a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /trips/:id/publish
  */
  app.route('/v1/trips/:id/publish')
    .patch(
      publishValidator,
      handleExpressValidation,
      tripsController.publishTrip
    )
  app.route('/v2/trips/:id/publish')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      publishValidator,
      handleExpressValidation,
      tripsController.publishTripAuth
    )

  /**
  * Cancel a trip
  *    RequiredRoles: to be manager who created the trip
  *
  * @section trips
  * @type patch
  * @url /trips/:id/cancel
  */
  app.route('/v1/trips/:id/cancel')
    .patch(
      cancelValidator,
      handleExpressValidation,
      tripsController.cancelTrip
    )
  app.route('/v2/trips/:id/cancel')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      cancelValidator,
      handleExpressValidation,
      tripsController.cancelTripAuth
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
  * @url /trips/:id/applications
  */
  app.route('/v1/trips/:id/applications')
    .get(tripsController.listTripApplications)
    .post(
      appCreationValidator,
      handleExpressValidation,
      tripsController.createTripApplication
    )
  app.route('/v2/trips/:id/applications')
    .get(
      verifyUser([RoleEnum.MANAGER]),
      tripsController.listTripApplicationsAuth
    )
    .post(
      verifyUser([RoleEnum.MANAGER]),
      appCreationValidator,
      handleExpressValidation,
      tripsController.createTripApplicationAuth
    )

}