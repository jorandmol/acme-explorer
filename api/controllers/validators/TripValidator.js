import { check } from 'express-validator'

// TODO:
// - Check startDate is future and before endDate
const creationValidator = [
  check('creator').exists({ checkNull: true, checkFalsy: true }).isMongoId().trim().escape(),
  check('title').exists({ checkFalsy: true }).isString().isLength({ max: 100 }).trim().escape(),
  check('description').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('requirements').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('startDate').exists({ checkFalsy: true }).isISO8601().toDate(),
  check('endDate').exists({ checkFalsy: true }).isISO8601().toDate()
]

// TODO:
// - Validate stages' properties
// - Check pictures has correct format
const updateValidator = [

]

export { creationValidator, updateValidator }