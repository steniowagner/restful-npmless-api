const { VALUES } = require('../utils/constants');

const checkIsAdminOrSelf = (req, res, next) => {
  try {
    const { user } = req.locals;
    const { id } = req.params;

    const isAdmin = user.role === VALUES.ADMIN_ROLE;
    const isSelf = id === user.id;

    if (!isAdmin && !isSelf) {
      return res.send().status(401).data({
        error: 'You cant\'t perform this action.',
      });
    }

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

module.exports = checkIsAdminOrSelf;
