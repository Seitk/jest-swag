# jest-swag

[![npm version](https://badge.fury.io/js/jest-swag.svg)](https://badge.fury.io/js/jest-swag)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
  
## Installation
  
```bash
$ yarn add jest-swag
```
  
## Introduction
  
Inspired by [rswag](https://github.com/rswag/rswag), *jest-swag* is a Jest plugin to provide the tooling to
  
* Generate Open API specification (check [Example JSON](https://github.com/Seitk/jest-swag/blob/master/example/swagger.json) and [Screenshot](https://raw.githubusercontent.com/Seitk/jest-swag/master/assets/screenshot.png))
* Write along with your controller tests ([along with your test cases](https://github.com/Seitk/jest-swag/blob/master/example/test/Post-with-jest-swag.spec.js))
* Covering end-to-end testing from route to middleware to controller to view (powered by [supertest](https://github.com/visionmedia/supertest))
* And more in dev

### Example on a simple Posts and Comments API

Written with basic jest test cases:

```
describe('GET /posts', () => {
  it('responds with json', done => {
    request(app)
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          posts: [expect.objectContaining({ id: 'A0' })],
          total: 1,
        });
        done();
      });
  });
});
```

Written with jest-swag:

```
swag({ app }, s => {
  s.group({ name: 'Posts', description: 'Operations on posts' }, () => {
    s.api('GET /posts', { parameters: require('./swagger/parameters/paginate') }, () => {
      const expects = { 'Content-Type': /json/ };
      s.test('Success', 200, {
        expects,
        content: require('./swagger/responses/postsResponse'),
        then: res => {
          expect(res.body).toEqual({
            posts: [expect.objectContaining({ id: 'A0' })],
            total: 1,
          });
        },
      });
    });
  });
});
```

*jest-swag* provides a structure like the following  

```
swag({ app }, s => {
  s.group({ name: '...', description: '...' }, () => {
    s.api('GET /', {}, () => {
      s.test('...', 200, {
        then: () => {
          ... other test cases ...
        }
      });
    });
  });
});
```
  
`swag` creates the interface for adding api and tests
  
`s.group` defines the swagger group of APIs
  
`s.api` defines a route with the input parameters
  
`s.test` defines a response with code and example, it will also includes a basic test with supertest

More example usages on:
  
https://github.com/Seitk/jest-swag/blob/master/example/test
  
## Quick Start
  
Edit your `package.json` to change configurations under `jest`:  
  
https://github.com/Seitk/jest-swag/blob/master/example/package.json
  
1. Change `testEnvironment` to `"jest-swag/environment"`
2. Add `jest-swag/setup` to `setupFilesAfterEnv`
3. Add `jest-swag/reporter` to `reporters`
4. Add `jest-swag` for specifying basic configuration on swagger schema
```
"jest-swag": {
  "schema": {
    "openapi": "3.0.0",
    "info": {
      "title": "Example API",
      "description": "An example on using jest-swag to generate api docs with jest test",
      "version": "1.0.0"
    },
    "host": "example.com",
    "schemes": [
      "http"
    ]
  }
},
```
    
Start writing tests with `swag` and run `jest`:

```bash
% yarn test
yarn run v1.21.1
$ jest
 PASS  test/Comment-with-jest-swag.spec.js
 PASS  test/Post-with-jest-swag.spec.js
 PASS  test/Post.spec.js

Test Suites: 3 passed, 3 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        1.116s
Ran all test suites.
[jest-swag] swagger specification generated to swagger.json
✨  Done in 1.85s.
```
  
The output file will be generated to the directory path, lift up api doc with [swagger-ui](https://www.npmjs.com/package/swagger-ui-express)
  
## License

[MIT](LICENSE)
