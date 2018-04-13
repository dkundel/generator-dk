const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const generator = require.resolve('../generators/coc');
const { initializeFiles } = require('./utils/fs');

describe('generator-dk:coc', () => {
  beforeAll(async () => {
    await helpers
      .run(generator)
      .inTmpDir(initializeFiles('coc', ['README.md']))
      .withOptions({
        contactEmail: 'some@email.com',
      });
  });

  test('updates README.md', () => {
    assert.noFileContent('README.md', '<!-- Insert CoC notice -->');
    assert.fileContent(
      'README.md',
      '[Contributor Code of Conduct](CODE_OF_CONDUCT.md)'
    );
  });

  test('creates CoC file', () => {
    assert.fileContent('CODE_OF_CONDUCT.md', 'some@email.com');
  });
});
