import { check } from 'express-validator'

const creationValidator = [
    check('defaultLanguage').optional().isString().isLength({ min: 2, max: 20 }).trim().escape(),
    check('cacheLifetime').optional().isNumeric().isLength({ min: 1, max: 36000 }).trim().escape(),
    check('numResults').optional().isNumeric().isLength({ min: 1, max: 50 }).trim().escape(),
    check('sponsorshipFlatRate').optional().isNumeric().isLength({ min: 0.1, max: 1 }).trim().escape()
]

export { creationValidator }