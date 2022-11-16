function tryCatch(endPoint) {
  return async (req, res, next) => {
    try {
      await endPoint(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
module.exports = { tryCatch };
