import { check } from 'express-validator'

const updateValidator = [
  check('sponsor').exists({ checkFalsy: true }).isMongoId(),
  check('banner').exists({ checkFalsy: true }),
  check('link').exists({ checkFalsy: true }).isURL(),
  check('financedAmount').optional().isFloat({ min: 0 }),
  check('paidAt').optional().isISO8601().toDate()
]

const creationValidator = [
  check('tripId').exists({ checkFalsy: true }).isMongoId(),
  check('banner').exists({ checkFalsy: true }).isBase64(),
  check('link').exists({ checkFalsy: true }).isURL()
]

export { creationValidator, updateValidator }