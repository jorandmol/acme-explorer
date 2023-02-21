import OperatorEnum from "../enum/OperatorEnum.js";

export const operationParser = async (req, res, next) => {
  const v = req.body.v;
  let operation = {};

  switch (req.body.theta) {
    case OperatorEnum.GT:
      operation = { "$gt": v };
      break;
    case OperatorEnum.GTE:
      operation = { "$gte": v };
      break;
    case OperatorEnum.LT:
      operation = { "$lt": v };
      break;
    case OperatorEnum.LTE:
      operation = { "$lte": v };
      break;
    case OperatorEnum.NE:
      operation = { "$eq": v };
      break;
    default:
      operation = { "$eq": v };
      break;
  }

  req.body.operation = operation;
  next();
};