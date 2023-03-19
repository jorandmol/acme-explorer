import * as sponsorshipController from '../controllers/SponsorshipController.js'
import { creationValidator, updateValidator } from '../controllers/validators/SponsorshipValidator.js'
import RoleEnum from '../enum/RoleEnum.js'
import { verifyUser } from '../middlewares/AuthMiddleware.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {

  /**
  * Post a sponsorship
  *    RequiredRoles: Sponsor
  * Get sponsor sponsorships
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type get post
  * @url /sponsorships
  */
  app.route('/v1/sponsorships')
    .get(sponsorshipController.listSponsorships)
    .post(
      creationValidator,
      handleExpressValidation,
      sponsorshipController.createSponsorship
    )
  app.route('/v2/sponsorships')
    .get(verifyUser([RoleEnum.SPONSOR]), sponsorshipController.listSponsorshipsAuth)
    .post(
      verifyUser([RoleEnum.SPONSOR]),
      creationValidator,
      handleExpressValidation,
      sponsorshipController.createSponsorshipAuth
    )

  /**
  * Put a sponsorship
  *    RequiredRoles: to be sponsor who created the sponsorship
  * Get a sponsorship
  *    RequiredRoles: None
  * Delete a sponsorship
  *    RequiredRoles: to be sponsor who created the sponsorship
  *
  * @section sponsorships
  * @type get put delete
  * @url /sponsorships/:id
  */
  app.route('/v1/sponsorships/:id')
    .get(sponsorshipController.readSponsorship)
    .put(
      updateValidator,
      handleExpressValidation,
      sponsorshipController.updateSponsorship
    ).delete(sponsorshipController.deleteSponsorship)
  app.route('/v2/sponsorships/:id')
    .get(sponsorshipController.readSponsorship)
    .put(
      verifyUser([RoleEnum.SPONSOR]),
      updateValidator,
      handleExpressValidation,
      sponsorshipController.updateSponsorshipAuth
    ).delete(verifyUser([RoleEnum.SPONSOR]), sponsorshipController.deleteSponsorshipAuth)

  /**
  * Pay a sponsorship
  *    RequiredRoles: to be sponsor who created the sponsorship
  *
  * @section sponsorships
  * @type patch
  * @url /sponsorships/:id/pay
  */
  app.route('/v1/sponsorships/:id/pay')
    .patch(sponsorshipController.paySponsorship)
  app.route('/v2/sponsorships/:id/pay')
    .patch(verifyUser([RoleEnum.SPONSOR]), sponsorshipController.paySponsorshipAuth)
}