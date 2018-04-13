const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { stripIndent } = require('common-tags');

const generator = require.resolve('../generators/wireframe');

const DEFAULT_OPTIONS = {
  name: 'my-test',
};

describe('generator-dk:wireframe', () => {
  describe('CLI wireframe', () => {
    describe('default', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'cli',
        });
      });

      test('updates package.json', () => {
        assert.fileContent('package.json', /"meow":/);
        assert.jsonFileContent('package.json', {
          main: 'index.js',
          bin: 'cli.js',
        });
      });

      test('creates two entry files', () => {
        assert.file(['cli.js', 'index.js']);

        assert.fileContent('cli.js', '#!/usr/bin/env node');
        assert.fileContent('cli.js', `const meow = require('meow')`);
        assert.fileContent('cli.js', `const { myTest } = require('.')`);
        assert.fileContent('cli.js', 'myTest(cli.input[0], cli.flags)');

        assert.fileContent('index.js', /function myTest\(\) {(.|\s)*?}/);
        assert.fileContent(
          'index.js',
          stripIndent`
        module.exports = {
          default: myTest,
          myTest
        }
      `
        );
      });
    });
    describe('for typescript', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'cli',
          typescript: true,
        });
      });

      test('updates package.json', () => {
        assert.fileContent('package.json', /"meow":/);
        assert.fileContent('package.json', /"@types\/meow":/);
        assert.jsonFileContent('package.json', {
          main: 'dist/index.js',
          bin: 'dist/cli.js',
        });
      });

      test('creates two entry files', () => {
        assert.file(['cli.ts', 'index.ts']);

        assert.fileContent('cli.ts', '#!/usr/bin/env node');
        assert.fileContent('cli.ts', `import * as meow from 'meow';`);
        assert.fileContent('cli.ts', `import myTest from './';`);
        assert.fileContent('cli.ts', 'console.log(cli.input[0], cli.flags)');
        assert.fileContent('cli.ts', 'myTest();');

        assert.fileContent(
          'index.ts',
          'export default function myTest(): void {'
        );
      });
    });
  });

  describe('module wireframe', () => {
    describe('default', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'module',
        });
      });

      test('updates package.json', () => {
        assert.jsonFileContent('package.json', {
          main: 'index.js',
        });
      });

      test('creates one entry file', () => {
        assert.file('index.js');

        assert.fileContent('index.js', /function myTest\(\) {(.|\s)*?}/);
        assert.fileContent(
          'index.js',
          stripIndent`
        module.exports = {
          default: myTest,
          myTest
        }
      `
        );
      });
    });

    describe('for typescript', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'module',
          typescript: true,
        });
      });

      test('updates package.json', () => {
        assert.jsonFileContent('package.json', {
          main: 'dist/index.js',
        });
      });

      test('creates one entry file', () => {
        assert.file('index.ts');

        assert.fileContent(
          'index.ts',
          'export default function myTest(): void {'
        );
      });
    });
  });

  describe('node wireframe', () => {
    describe('default', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'node',
        });
      });

      test('updates package.json', () => {
        assert.jsonFileContent('package.json', {
          main: 'index.js',
          scripts: {
            start:
              'if-env NODE_ENV=production && npm run start:prod || npm run start:dev',
            'start:prod': 'node .',
            'start:dev': 'nodenv .',
          },
        });

        assert.fileContent('package.json', /"node-env-run":/);
        assert.fileContent('package.json', /"if-env":/);
      });

      test('creates one entry file', () => {
        assert.file('index.js');

        assert.fileContent('index.js', `console.log('Welcome 👋');`);
      });
    });

    describe('for typescript', () => {
      beforeAll(async () => {
        await helpers.run(generator).withOptions({
          ...DEFAULT_OPTIONS,
          type: 'node',
          typescript: true,
        });
      });

      test('updates package.json', () => {
        assert.jsonFileContent('package.json', {
          main: 'dist/index.js',
          scripts: {
            start:
              'if-env NODE_ENV=production && npm run start:prod || npm run start:dev',
            'start:prod': 'node .',
            'start:dev': 'nodenv index.ts --exec "ts-node"',
          },
        });
        assert.fileContent('package.json', /"ts-node":/);
        assert.fileContent('package.json', /"node-env-run":/);
        assert.fileContent('package.json', /"if-env":/);
      });

      test('creates two entry files', () => {
        assert.file('index.ts');

        assert.fileContent('index.ts', `console.log('Welcome 👋');`);
      });
    });
  });
});
