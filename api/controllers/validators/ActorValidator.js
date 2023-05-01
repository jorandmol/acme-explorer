import { check } from 'express-validator'

const creationValidator = [
  check('name').exists({ checkFalsy: true }).isString().isLength({ min: 2, max: 20 }).trim().escape(),
  check('surname').exists({ checkFalsy: true }).isString().isLength({ min: 2, max: 20 }).trim().escape(),
  check('email').exists({ checkFalsy: true }).isEmail().isLength({ min: 5, max: 50 }).trim().escape(),
  check('password').exists({ checkFalsy: true }).isString().isLength({ min: 8, max: 20 }).trim().escape(),
  check('phone').optional({checkFalsy: true}).isString().isLength({ min: 9, max: 20 }).trim().escape(),
  check('address').optional({checkFalsy: true}).isString().isLength({ min: 5, max: 50 }).trim().escape(),
  check('role').exists({ checkFalsy: true }).isString().isLength({ min: 5, max: 20 }).trim().escape(),
  check('ban.date').optional().isISO8601().toDate(),
  check('ban.reason').optional().isString().isLength({ min: 5, max: 50 }).trim().escape()
]

export { creationValidator }