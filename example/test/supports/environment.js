const NodeEnvironment = require('jest-environment-node');

let test = 1;

class Environment extends NodeEnvironment {
  async setup(jestConfig = {}) {
    this.global.wtf = test;

    console.log('==== wtf', this.global.wtf);
  }

  async teardown(jestConfig = {}) {
    console.log('==== bbq', this.global.wtf);
  }
}

module.exports = Environment;
