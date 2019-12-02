const { VALUES } = require('../utils/constants');

const checkIsAdmin = (req, res, next) => {
  try {
    const { user } = req.locals;

    if (user.role !== VALUES.ADMIN_ROLE) {
      return res.send().status(401).data({
        error: 'You don\'t have privileges to perform this action.',
      });
    }

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

module.exports = checkIsAdmin;
