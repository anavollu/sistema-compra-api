async function auth(req, res, next, roles = []) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    // only let requests with allowed role go to next middleware
    if (roles.includes(token)) return next();
    const noAuthError = new Error('your role is not authorized');
    noAuthError.status = 403;
    return next(noAuthError);
  }
  const noAuthError = new Error('no authroization header');
  noAuthError.status = 401;
  return next(noAuthError);
}

function generateAuth(roles) {
  return (req, res, next) => auth(req, res, next, roles);
}

module.exports = (...roles) => generateAuth(roles);
