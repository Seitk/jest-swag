const NodeEnvironment = require('jest-environment-node');
const Generator = require('./Generator');

class Environment extends NodeEnvironment {
  async setup() {
    // Setup tmp storage for test run
    this.global.swaggerTags = [];
    this.global.swaggerTests = [];
  }

  async teardown() {
    // Cache data into file for concating in the end
    await Generator.cacheData(this.global.swaggerTests, this.global.swaggerTags);
  }
}

module.exports = Environment;
