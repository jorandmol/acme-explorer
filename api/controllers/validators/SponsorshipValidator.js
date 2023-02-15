import { check } from 'express-validator'

const creationValidator = [
  check('sponsor').exists({ checkFalsy: true }).isMongoId(),
  check('banner').exists({ checkFalsy: true }).isURL(),
  check('link').exists({ checkFalsy: true }).isURL(),
  check('isPayed').optional().isBoolean()
]

const updateValidator = [
  ...creationValidator,
  check('isPayed').exists().isBoolean()
]

export { creationValidator, updateValidator }