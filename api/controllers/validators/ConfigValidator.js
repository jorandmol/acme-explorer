import { check } from 'express-validator'

const configValidator = [
    check('defaultLanguage').optional().isString().isLength({ min: 2, max: 20 }).trim().escape(),
    check('cacheLifetime').optional().isInt({ min: 5, max: 36000 }).trim().escape(),
    check('numResults').optional().isInt({ min: 1, max: 50 }).trim().escape(),
    check('sponsorshipFlatRate').optional().isFloat({ min: 0.1, max: 1 }).trim().escape(),
    check('dataWhRefresh').optional().isInt({ min: 5, max: 36000 }).trim().escape(),
]

export { configValidator }