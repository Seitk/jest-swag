const supertest = require('supertest');
const qs = require('qs');

class Plugin {
  static swag({ app }, next) {
    let scope = {};

    afterEach(() => {
      // Resetting the test info after the test
      scope = {};
    });

    return next({
      group: (group, next) => {
        describe(`API Group [${group.name}] - ${group.description}`, () => {
          beforeEach(() => {
            scope.tags = scope.tags || [];
            scope.tags.push(group);
          });
          next();
        });
      },
      api: (request, options, next) => {
        const [method, path] = request.split(' ');
        describe(`${method} ${path}`, () => {
          beforeEach(() => {
            scope.api = { path: path.replace(/\:([a-zA-Z_-]+)/, '{$1}'), ...options };
            scope.method = method;
          });
          next();
        });
      },
      test: (description, code, options) => {
        beforeEach(() => {
          scope.response = { description, code, ...options };
        });

        global.test(description, done => {
          if (!scope.api) {
            throw 'jest-swag test should be within the closure of api';
          }

          let route = scope.api.path;
          if (options.params) {
            Object.keys(options.params).forEach(key => {
              // Convert express route :param syntax to {param}
              route = route.replace(`\{${key}\}`, options.params[key]);
            });
          }

          if (options.query) {
            route = `${route}?${qs.stringify(options.query)}`;
          }

          let chain = supertest(app)
            [scope.method.toLowerCase()](route)
            .expect(scope.response.code);

          if (options.body) {
            chain = chain.send(options.body);
          }

          if (options.expects) {
            Object.keys(options.expects).forEach(key => {
              chain = chain.expect(key, options.expects[key]);
            });
          }

          chain.then(res => {
            if (options && options.then) {
              options.then(res);
            }

            // Store tests and tags into a tmp store for each run

            if (scope.tags) {
              scope.tags.forEach(tag => {
                if (
                  !global.swaggerTags.find(t => {
                    return t.name == tag.name;
                  })
                ) {
                  global.swaggerTags.push(tag);
                }
              });
            }

            global.swaggerTests.push(scope);

            done();
          });
        });
      },
    });
  }

  static get methods() {
    return {
      swag: this.swag,
    };
  }
}

module.exports = Plugin;
