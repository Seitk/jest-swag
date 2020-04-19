const Promise = require('bluebird');
const lockfile = require('proper-lockfile');
const fs = require('fs-extra');

// Assign key with an defaultValue if key does not present
const initialObject = (object, key, defaultValue = {}) => {
  if (object[key] === undefined) {
    object[key] = defaultValue;
  }
  return object[key];
};

// Returns simple key-example pairs in swagger schema format
const swaggerSchema = (schema) => ({
  type: 'object',
  properties: Object.keys(schema).reduce((acc, key) => {
    if (typeof schema[key] !== 'object') {
      acc[key] = {
        example: schema[key],
      };
    } else {
      acc[key] = swaggerSchema(schema[key]);
    }
    return acc;
  }, {}),
});

// Save data into file with a file mutex lock, retries in a random backoff
const saveToFileInBand = (tmpFile, lockFile, data) => {
  let cleanup;
  return Promise.try(() => fs.ensureFile(tmpFile) && fs.ensureFile(lockFile), // fs-extra creates file if needed
  )
    .then(() => lockfile.lock(lockFile, {
      retries: {
        retries: 5,
        factor: 3,
        minTimeout: 1 * 1000,
        maxTimeout: 5 * 1000,
        randomize: true,
      },
    }))
    .then((release) => {
      cleanup = release;

      const content = loadFile(tmpFile).concat(data);
      fs.writeFileSync(tmpFile, JSON.stringify(content, null, 2), 'utf8');

      return Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      cleanup && cleanup();
    });
};

const loadFile = (file, defaultValue = []) => {
  let data = fs.readFileSync(file, 'utf-8');
  try {
    data = JSON.parse(data); // Force to json format
  } catch (e) {}
  if (typeof data !== 'object') {
    // Initialize in case the tmp file is not here
    data = defaultValue;
  }
  return data;
};

module.exports = {
  initialObject,
  swaggerSchema,
  saveToFileInBand,
  loadFile,
};
