const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { stripIndent } = require('common-tags');

const generator = require.resolve('../generators/badges');
const { initializeFiles } = require('./utils/fs');

const DEFAULT_OPTIONS = {
  moduleName: 'my-test',
  githubAccount: 'dkundel',
  repositoryName: 'test-proj',
};

function createBadge(altText, imgSrc, link) {
  return `[![${altText}](${imgSrc})](${link})`;
}

const DEFAULT_BADGES = {
  npmVersion: createBadge(
    'npm',
    'https://img.shields.io/npm/v/my-test.svg?style=flat-square',
    'https://npmjs.com/packages/my-test'
  ),
  npmDownloads: createBadge(
    'npm',
    'https://img.shields.io/npm/dt/my-test.svg?style=flat-square',
    'https://npmjs.com/packages/my-test'
  ),
  travis: createBadge(
    'Build Status',
    'https://img.shields.io/travis/dkundel/test-proj.svg?branch=master&style=flat-square',
    'https://travis-ci.org/dkundel/test-proj'
  ),
  contributors: createBadge(
    'All Contributors',
    'https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square',
    '#contributors'
  ),
  coc: createBadge(
    'Code of Conduct',
    'https://img.shields.io/badge/%F0%9F%92%96-Code%20of%20Conduct-ff69b4.svg?style=flat-square',
    'CODE_OF_CONDUCT.md'
  ),
  prettier: createBadge(
    'code style: prettier',
    'https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square',
    'https://github.com/prettier/prettier'
  ),
};

describe('generator-dk:badges', () => {
  describe('default', () => {
    beforeAll(async () => {
      await helpers
        .run(generator)
        .inTmpDir(initializeFiles('badges', ['README.md']))
        .withOptions({
          ...DEFAULT_OPTIONS,
        });
    });

    test('ignores remaining README', () => {
      assert.fileContent('README.md', '# Some Headline');
      assert.fileContent('README.md', '## Another Headline');
    });

    test('renders default badges', () => {
      assert.fileContent('README.md', DEFAULT_BADGES.npmVersion);
      assert.fileContent('README.md', DEFAULT_BADGES.npmDownloads);
      assert.fileContent('README.md', DEFAULT_BADGES.travis);
      assert.fileContent('README.md', DEFAULT_BADGES.contributors);
      assert.fileContent('README.md', DEFAULT_BADGES.coc);
      assert.fileContent('README.md', DEFAULT_BADGES.prettier);
    });
  });

  describe('no-npm', () => {
    beforeAll(async () => {
      await helpers
        .run(generator)
        .inTmpDir(initializeFiles('badges', ['README.md']))
        .withOptions({ ...DEFAULT_OPTIONS, npm: false });
    });

    test('ignores remaining README', () => {
      assert.fileContent('README.md', '# Some Headline');
      assert.fileContent('README.md', '## Another Headline');
    });

    test('renders default badges', () => {
      assert.noFileContent('README.md', DEFAULT_BADGES.npmVersion);
      assert.noFileContent('README.md', DEFAULT_BADGES.npmDownloads);
    });
  });

  describe('no-travis', () => {
    beforeAll(async () => {
      await helpers
        .run(generator)
        .inTmpDir(initializeFiles('badges', ['README.md']))
        .withOptions({ ...DEFAULT_OPTIONS, travis: false });
    });

    test('ignores remaining README', () => {
      assert.fileContent('README.md', '# Some Headline');
      assert.fileContent('README.md', '## Another Headline');
    });

    test('renders default badges', () => {
      assert.noFileContent('README.md', DEFAULT_BADGES.travis);
    });
  });

  describe('no-contributors', () => {
    beforeAll(async () => {
      await helpers
        .run(generator)
        .inTmpDir(initializeFiles('badges', ['README.md']))
        .withOptions({ ...DEFAULT_OPTIONS, contributors: false });
    });

    test('ignores remaining README', () => {
      assert.fileContent('README.md', '# Some Headline');
      assert.fileContent('README.md', '## Another Headline');
    });

    test('renders default badges', () => {
      assert.noFileContent('README.md', DEFAULT_BADGES.contributors);
    });
  });

  describe('no-travis', () => {
    beforeAll(async () => {
      await helpers
        .run(generator)
        .inTmpDir(initializeFiles('badges', ['README.md']))
        .withOptions({ ...DEFAULT_OPTIONS, codeOfConduct: false });
    });

    test('ignores remaining README', () => {
      assert.fileContent('README.md', '# Some Headline');
      assert.fileContent('README.md', '## Another Headline');
    });

    test('renders default badges', () => {
      assert.noFileContent('README.md', DEFAULT_BADGES.coc);
    });
  });
});
