const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const Generator = require('yeoman-generator');

const generator = require.resolve('../generators/contributors');
const { initializeFiles } = require('./utils/fs');

const DEFAULT_OPTIONS = {
  githubAccount: 'dkundel',
  projectName: 'test-proj',
};

describe('generator-dk:contributors', () => {
  beforeAll(async () => {
    await helpers
      .run(generator)
      .inTmpDir(initializeFiles('contributors', ['README.md']))
      .withOptions(DEFAULT_OPTIONS);
  });

  test('updates README.md', () => {
    assert.noFileContent('README.md', '<!-- Insert contributors -->');
    assert.fileContent('README.md', 'Thanks goes to these wonderful people');
    assert.fileContent(
      'README.md',
      'This project follows the [all-contributors]'
    );
    assert.fileContent(
      'README.md',
      '<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->'
    );
    assert.fileContent('README.md', '<!-- ALL-CONTRIBUTORS-LIST:END -->');
  });

  test('configures package.json', () => {
    assert.fileContent('package.json', /"all-contributors-cli":/);
    assert.jsonFileContent('package.json', {
      scripts: {
        'contrib:add': 'all-contributors add',
        'contrib:gen': 'all-contributors generate',
      },
    });
  });

  test('creates .all-contributorsrc', () => {
    assert.file(['.all-contributorsrc']);
    assert.jsonFileContent('.all-contributorsrc', {
      projectName: 'test-proj',
      projectOwner: 'dkundel',
      files: ['README.md'],
      imageSize: 100,
      commit: false,
      contributors: [],
    });
  });

  test('calls all-contributors cli', () => {
    expect(Generator.prototype.spawnCommandSync).toHaveBeenCalledWith('npx', [
      'all-contributors',
      'add',
      'dkundel',
      'code,design,ideas,review,doc',
    ]);
  });
});
