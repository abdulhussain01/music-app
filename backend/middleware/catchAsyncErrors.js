export const catchAsyncErrors = (resolveFunction) => {
  return (req, res, next) =>
    Promise.resolve(resolveFunction(req, res, next)).catch(next);
};
