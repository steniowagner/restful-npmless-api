const path = require('path');

const env = require('../../config/environments');

const srcFolderNormalized = path.normalize('/server/');

const VALUES = {
  DATA_PATH: path.normalize(`${__dirname.split(srcFolderNormalized)[0]}/${env.dataDir}`),
  ID_LENGHT: 13,
};

module.exports = VALUES;
