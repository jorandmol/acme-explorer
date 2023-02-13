import { check } from 'express-validator'

// TODO: Validate the optional ones
const creationValidator = [
  check('explorer').exists({ checkFalsy: true }).isMongoId()
]

export { creationValidator }