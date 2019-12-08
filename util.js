const tryGetHttpResponseError = err => {
  const { response: { data, statusText } = {} } = err;
  return { data, statusText };
};

const removeStackProperty = obj =>
  Object.getOwnPropertyNames(obj).reduce((acc, key) => {
    if (key.toLowerCase() !== "stack") {
      acc[key] = obj[key];
      return acc;
    } else return acc;
  }, {});

const cleanErrorResponse = err =>
  tryGetHttpResponseError(err) || removeStackProperty(err);

const sendErrorResponse = (res, err) =>
  res.status(400).send(cleanErrorResponse(err));

const getRandomIndex = max => Math.floor(Math.random() * Math.floor(max));

const getRandomUniqueNumbers = (length, maxRandomNumbers) =>
  [...new Array(length)].reduce((acc, curValue, curIndex) => {
    let randomIndex = getRandomIndex(maxRandomNumbers);
    while (acc.includes(randomIndex))
      randomIndex = getRandomIndex(maxRandomNumbers);
    acc.push(randomIndex);
    return acc;
  }, []);

module.exports = {
  sendErrorResponse,
  removeStackProperty,
  cleanErrorResponse,
  tryGetHttpResponseError,
  getRandomUniqueNumbers
};
