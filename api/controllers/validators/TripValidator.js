import { check } from 'express-validator'

const creationValidator = [
  check('creator').exists({ checkFalsy: true }).isMongoId(),
  check('description').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('requirements').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('startDate').exists({ checkFalsy: true }).isISO8601().toDate(),
  check('endDate').exists({ checkFalsy: true }).isISO8601().toDate()
]

export { creationValidator }