import { check } from 'express-validator'
import StatusEnum from '../../enum/StatusEnum.js'

// TODO: Validate the optional ones
const creationValidator = [
  check('explorer').exists({ checkFalsy: true }).isMongoId(),
  check('trip').exists({ checkFalsy: true }).isMongoId(),
  check('comment').optional().isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

const updateValidator = [
  check('status').exists({ checkFalsy: true }).isIn(Object.values(StatusEnum)),
  check('explorer').exists({ checkFalsy: true }).isMongoId(),
  check('trip').exists({ checkFalsy: true }).isMongoId(),
  check('cancellationReason').optional().isString().isLength({ min: 10, max: 255 }).trim().escape(),
  check('comment').optional().isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

export { creationValidator, updateValidator}