import { check } from 'express-validator'

const creationValidator = [
  check('banner').exists({ checkFalsy: true }).isURL(),
  check('link').exists({ checkFalsy: true }).isURL()
]

export { creationValidator }