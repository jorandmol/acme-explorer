import { check } from 'express-validator'

const creationValidator = [
  check('tripId').exists({ checkFalsy: true }).isMongoId(),
  ...updateValidator
]

const updateValidator = [
  check('sponsor').exists({ checkFalsy: true }).isMongoId(),
  check('banner').exists({ checkFalsy: true }).isBase64(),
  check('link').exists({ checkFalsy: true }).isURL()
]

export { creationValidator, updateValidator }