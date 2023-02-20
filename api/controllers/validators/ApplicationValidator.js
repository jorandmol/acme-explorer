import { check } from 'express-validator'
import StatusEnum from '../../enum/StatusEnum.js'

const creationValidator = [
  check('trip').exists({ checkFalsy: true }).isMongoId(),
  check('explorer').exists({ checkFalsy: true }).isMongoId(),
  check('comments').optional().isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

const creationFromTripValidator = [
  check('explorer').exists({ checkFalsy: true }).isMongoId(),
  check('comments').optional().isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

const updateCommentsValidator = [
  check('comments').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

const rejectionValidator = [
  check('rejectionReason').exists({ checkFalsy: true }).isString().isLength({ min: 10, max: 255 }).trim().escape(),
]

export { creationValidator, creationFromTripValidator, updateCommentsValidator, rejectionValidator}