const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const { VALUES } = require('../../src/utils/constants');

const asyncExec = promisify(exec);

const removeDataDir = async () => {
  const isWin = process.platform === "win32";

  const isDirExists = fs.existsSync(VALUES.DATA_PATH);

  if (!isDirExists) {
    return;
  }

  const removeDir =
    isWin ?
      () => asyncExec(`rmdir /Q /S ${VALUES.DATA_PATH}`)
      : () => asyncExec(`rm -Rf ${VALUES.DATA_PATH}`);

  await removeDir();
};

module.exports = removeDataDir;
