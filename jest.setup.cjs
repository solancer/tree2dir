// This file is used to setup Jest for TypeScript testing
// It will be automatically loaded by Jest before each test suite

// Explicitly mark TypeScript globals as available
global.expect = expect;
global.jest = jest;
global.describe = describe;
global.test = test;
global.beforeEach = beforeEach;
global.afterEach = afterEach; 