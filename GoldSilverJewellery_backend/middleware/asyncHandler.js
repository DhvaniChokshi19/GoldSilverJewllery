/**
 * Higher-order function to catch async errors in Express route handlers.
 * Eliminates repetitive try-catch blocks in controller methods.
 * @param {Function} fn - Async controller function (req, res, next)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
