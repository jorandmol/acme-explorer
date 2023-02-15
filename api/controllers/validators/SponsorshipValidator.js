import { check } from 'express-validator'

const creationValidator = [
  check('sponsor').exists({ checkFalsy: true }).isMongoId(),
  check('banner').exists({ checkFalsy: true }).isBase64(),
  check('link').exists({ checkFalsy: true }).isURL()
]

export { creationValidator }