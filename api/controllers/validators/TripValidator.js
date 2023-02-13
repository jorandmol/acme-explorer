import { check } from 'express-validator'

const _isFuture = (date) => {
  const now = new Date()
  if (date.getTime() < now.getTime()) {
    throw new Error('The date must be in the future')
  }
  return true
}

const _startDateIsBefore = (startDate, { req }) => {
  let { endDate } = req.body
  if (startDate >= endDate) {
    throw new Error('Start date must be before end date')
  }
  return true
}

const creationValidator = [
  check('creator').exists({ checkNull: true, checkFalsy: true }).isMongoId().trim().escape(),
  check('title').exists({ checkFalsy: true }).isString().isLength({ max: 100 }).trim().escape(),
  check('description').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('requirements').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('startDate').exists({ checkFalsy: true }).isISO8601().toDate().custom(_isFuture).custom(_startDateIsBefore),
  check('endDate').exists({ checkFalsy: true }).isISO8601().toDate().custom(_isFuture)
]

// TODO:
// Ask if it's possible to make 'pictures' optional but their values not
const updateValidator = [
  check('title').exists({ checkFalsy: true }).isString().isLength({ max: 100 }).trim().escape(),
  check('description').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('requirements').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('startDate').exists({ checkFalsy: true }).isISO8601().toDate().custom(_isFuture).custom(_startDateIsBefore),
  check('endDate').exists({ checkFalsy: true }).isISO8601().toDate().custom(_isFuture),
  check('price').optional().isFloat({ min: 0 }),
  check('pictures.*.title').optional().isString().isLength({ max: 100 }).trim().escape(),
  check('pictures.*.image').optional().isString().isBase64()
]

const stageValidator = [
  check('stages.*.title').exists({ checkFalsy: true }).isString().isLength({ max: 100 }).trim().escape(),
  check('stages.*.description').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('stages.*.price').exists({ checkFalsy: true }).isFloat({ min: 10 })
]

const cancellationValidator = [
  check('cancellationReason').exists({ checkFalsy: true }).isString().isLength({ min: 25, max: 255 }).trim().escape(),
]

export { creationValidator, updateValidator, stageValidator, cancellationValidator }