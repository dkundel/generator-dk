const Generator = require('yeoman-generator');

class MockedGenerator extends Generator {}

MockedGenerator.prototype.spawnCommandSync = jest.fn().mockImplementation();

module.exports = MockedGenerator;
