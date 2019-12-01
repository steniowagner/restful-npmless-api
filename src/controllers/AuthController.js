const encryptStringWithSHA256 = require('./utils/encryptStringWithSHA256');
const { generateToken } = require('./utils/tokens');

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

    const isPasswordCorrect = encryptStringWithSHA256(password) === user.password;

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
    const { token: userToken } = req.payload;
    const { id } = req.params;

    if (!userToken) {
      return res.send().status(400).data({
        error: 'Token is required.',
      });
    }

    const tokenFromDB = await Token.findOne(userToken);

    if (!tokenFromDB) {
      return res.send().status(403).data({
        error: 'Token doesn\'t exists.',
      });
    }

    if (id !== tokenFromDB.userId) {
      return res.send().status(403).data({
        error: 'This token isn\'t yours.',
      });
    }

    if (Date.now() > tokenFromDB.expires) {
      return res.send().status(403).data({
        error: 'Token expired.',
      });
    }

    const user = await User.findOne(tokenFromDB.userId);

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
