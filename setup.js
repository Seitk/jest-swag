/**
 * Installs jest-swag and makes it available as a global function throughout all
 * test files.
 */
Object.assign(global, require('./lib/Plugin').methods);
