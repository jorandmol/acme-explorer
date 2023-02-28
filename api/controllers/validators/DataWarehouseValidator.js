import { check } from "express-validator"
import OperatorEnum from "../../enum/OperatorEnum.js"

const _checkPeriodFormat = async (period, { req }) => {
    const regex = /^M[0-9]{2}$|^Y[0-9]{2}$/
    if (regex.test(period)) {
        const periodValue = parseInt(period.substring(1, 3))
        if (period[0] === "M") {
            if (periodValue > 0 && periodValue <= 36) {
                return Promise.resolve("Period format OK")
            } else {
                return Promise.reject(new Error("Invalid period format"))
            }
        } else if (period[0] === "Y") {
            if (periodValue > 0 && periodValue <= 3) {
                return Promise.resolve("Period format OK")
            } else {
                return Promise.reject(new Error("Invalid period format"))
            }
        }
    } else {
        return Promise.reject(new Error("Invalid period format"))
    }
}

const rebuildPeriodValidator = [
    check("period").exists({ checkFalsy: true }).isInt({ min: 5, max: 36000 }).trim().escape()
];

const spentMoneyByExplorerValidator = [
    check("period").exists({ checkFalsy: true }).isString().trim().escape().custom(_checkPeriodFormat),
    check("explorer").exists({ checkFalsy: true }).isMongoId()
];

const explorersBySpentMoneyValidator = [
    check("period").exists({ checkFalsy: true }).isString().trim().escape().custom(_checkPeriodFormat),
    check("theta").exists({ checkFalsy: true }).isString().trim().escape().isIn(Object.values(OperatorEnum)),
    check("v").exists({ checkFalsy: true }).isNumeric()
];

export { rebuildPeriodValidator, spentMoneyByExplorerValidator, explorersBySpentMoneyValidator }