const encryptStringWithSHA256 = require('../utils/encryptStringWithSHA256');
const { generateToken } = require('../utils/tokens');

const Token = require('../models/Token');
const User = require('../models/User');

const TOKEN_DURATION = 1000 * 60 * 60; // one hour

exports.authenticate = async (req, res) => {
  try {
    const { username, password } = req.payload;

    if (!username || !password) {
      return res.send().status(400).data({
        error: 'The username and password must be provided.',
      });
    }

    const isCredentialsWrongType = typeof username !== 'string'
      || typeof password !== 'string';

    if (isCredentialsWrongType) {
      return res.send().status(400).data({
        error: 'The specified credentials must be strings.',
      });
    }

    const [user] = await User.findAll({
      username,
    });

    if (!user) {
      return res.send().status(400).data({
        error: 'User not found.',
      });
    }

    const isPasswordCorrect = encryptStringWithSHA256(password) === user.passwordHash;

    if (!isPasswordCorrect) {
      return res.send().status(401).data({
        error: 'Password incorrect.',
      });
    }

    const token = await Token.create({
      expires: Date.now() + TOKEN_DURATION,
      token: generateToken(),
      userId: user.id,
    });

    return res.send().status(201).data({ token });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const { token: userToken, user_id } = req.headers;

    if (!userToken) {
      return res.send().status(400).data({
        error: 'Token is required.',
      });
    }

    if (!user_id) {
      return res.send().status(400).data({
        error: 'You must specify your id.',
      });
    }

    const tokenFromDB = await Token.findOne(userToken);

    if (!tokenFromDB) {
      return res.send().status(403).data({
        error: 'Token doesn\'t exists.',
      });
    }

    if (user_id !== tokenFromDB.userId) {
      return res.send().status(403).data({
        error: 'This token isn\'t yours.',
      });
    }

    if (Date.now() > tokenFromDB.expires) {
      return res.send().status(403).data({
        error: 'Token expired.',
      });
    }

    const user = await User.findOne(user_id);

    if (!user) {
      return res.send().status(404).data({
        error: 'User not found.',
      });
    }

    req.locals = {
      ...req.locals,
      user,
    };

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

const handleRemoveToken = async req => {
  const { token } = req.headers;

  await Token.findOneAndRemove(token);
};

exports.removeToken = async (req, res, next) => {
  try {
    await handleRemoveToken(req);

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await handleRemoveToken(req);

    return res.send().status(200).data({
      message: 'Logged-out.',
    });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
