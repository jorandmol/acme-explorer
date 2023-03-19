import * as sponsorshipController from '../controllers/SponsorshipController.js'
import { creationValidator, updateValidator } from '../controllers/validators/SponsorshipValidator.js'
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
  * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
    .get(sponsorshipController.listSponsorships)
    .post(
      creationValidator,
      handleExpressValidation,
      sponsorshipController.createSponsorship
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
  * @url /v1/sponsorships/:id
  */
  app.route('/v1/sponsorships/:id')
    .get(sponsorshipController.readSponsorship)
    .put(
      updateValidator,
      handleExpressValidation,
      sponsorshipController.updateSponsorship
    ).delete(sponsorshipController.deleteSponsorship)

  /**
  * Pay a sponsorship
  *    RequiredRoles: to be sponsor who created the sponsorship
  *
  * @section sponsorships
  * @type patch
  * @url /v1/sponsorships/:id/pay
  */
  app.route('/v1/sponsorships/:id/pay')
    .patch(sponsorshipController.paySponsorship)

}