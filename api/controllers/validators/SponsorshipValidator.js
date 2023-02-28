import { check } from 'express-validator'

const updateValidator = [
  check('banner').exists({ checkFalsy: true }).isBase64(),
  check('link').exists({ checkFalsy: true }).isURL()
]

const creationValidator = [
  check('tripId').exists({ checkFalsy: true }).isMongoId(),
  ...updateValidator
]

export { creationValidator, updateValidator }