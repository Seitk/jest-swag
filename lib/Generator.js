const { omit, uniq, uniqBy } = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');

const { initialObject, swaggerSchema, saveToFileInBand, loadFile } = require('./Helper');
const packageConfig = require(`${process.cwd()}/package.json`);

const testsFile = `${process.cwd()}/jest-swag.tests`;
const tagsFile = `${process.cwd()}/jest-swag.tags`;
const swaggerFile = `${process.cwd()}/swagger.json`;

class Generator {
  static get defaults() {
    return {
      title: 'Untitled',
      description: '',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      host: 'localhost',
      basePath: '/',
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [],
      paths: {},
      definitions: [],
    };
  }

  static cacheData(swaggerTests, swaggerTags) {
    return Promise.all([
      saveToFileInBand(testsFile, `${testsFile}.lock`, swaggerTests),
      saveToFileInBand(tagsFile, `${tagsFile}.lock`, swaggerTags),
    ]);
  }

  static format(info, { api, method, tags, params, response }) {
    const { path, parameters } = api;
    const pathObject = initialObject(info.paths, path, {});
    const apiObject = initialObject(pathObject, method.toLowerCase(), {
      tags: uniq(tags.map(tag => tag.name)),
      parameters: parameters || [],
      produces: ['application/json'],
      responses: {},
    });

    ['description', 'requestBody'].forEach(key => {
      if (api[key]) {
        apiObject[key] = api[key];
      }
    });

    if (response) {
      const schema = omit(response, 'code', 'expects', 'params', 'body', 'then', 'example');
      if (response.example) {
        schema.content = {
          'application/json': {
            schema: swaggerSchema(response.example),
          },
        };
      }
      apiObject.responses[response.code] = schema;
    }
  }

  // Hook of reporter
  onRunComplete() {
    try {
      const tests = loadFile(testsFile);
      const tags = loadFile(tagsFile);

      const config = packageConfig['jest-swag'] || {};
      const swaggerInfo = { ...Generator.defaults, ...(config.schema || {}) };

      swaggerInfo.tags = uniqBy(tags, 'name');

      // Reconstruct tests data into swagger format
      tests.forEach(test => {
        this.constructor.format(swaggerInfo, test);
      });

      const content = JSON.stringify(swaggerInfo, null, 2);
      fs.writeFileSync(swaggerFile, content, 'utf8');
      console.log(`[jest-swag] swagger specification generated to ${swaggerFile}`);
    } catch (e) {
      console.error(e);
    }

    // Clean up tmp files
    [testsFile, tagsFile, `${testsFile}.lock`, `${tagsFile}.lock`].forEach(file => {
      fs.unlink(file, () => {});
    });
  }
}

module.exports = Generator;
