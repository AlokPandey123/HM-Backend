const ApiError = require('../utils/ApiError');

const checkPermission = (module, action) => (req, res, next) => {
  const { user } = req;

  if (user.role === 'superadmin') return next();

  const perm = user.permissions?.find((p) => p.module === module);
  if (!perm || !perm.actions.includes(action)) {
    throw new ApiError(403, `Permission denied: ${action} on ${module}`);
  }

  next();
};

module.exports = { checkPermission };
