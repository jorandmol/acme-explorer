export const periodDecoder = async (req, res, next) => {
  const period = req.body.period;
  const periodType = period[0];
  const periodValue = period.substring(1, 3);
  const endDate = new Date();
  const startDate = new Date();

  if (periodType === "Y") {
      startDate.setFullYear(startDate.getFullYear() - periodValue);
  }
  if (periodType === "M") {
      startDate.setMonth(startDate.getMonth() - periodValue);
  }

  req.body.startDate = startDate;
  req.body.endDate = endDate;
  next();
};