const keys = ['a', 'f', 'k', 'p', 'u', '1', '3', '5', '7', '9'];

const MAX_LENGTH_TOKEN = 10;

exports.generateToken = () => {
  const generateRandomNumber = seed => {
    const newSeed = Math.sin(seed) * 10000;
    return newSeed - Math.floor(newSeed);
  };

  const randomNumber = generateRandomNumber(Date.now());
  const [_, keyIndexes] = randomNumber.toString().split('.');

  const token = keyIndexes.substring(0, MAX_LENGTH_TOKEN).split('')
    .map(keyIndex => keys[keyIndex]).join('');

  return token;
};

exports.checkIsTokenValid = token => {
  if (typeof token !== 'string') {
    return false;
  }

  const isAllCharactersValids = token.split('')
    .every(tokenKey => keys.includes(tokenKey));

  const hasCorrectLength = token.length === MAX_LENGTH_TOKEN;

  return isAllCharactersValids && hasCorrectLength;
};
