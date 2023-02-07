import { check } from 'express-validator'

const creationValidator = [
  check('explorer').exists({ checkFalsy: true }).isMongoId(),
  check('trip').exists({ checkFalsy: true }).isMongoId()
]

export { creationValidator }