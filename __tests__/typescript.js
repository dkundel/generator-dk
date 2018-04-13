const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const generator = require.resolve('../generators/typescript');
const { initializeFiles } = require('./utils/fs');

describe('generator-dk:coc', () => {
  describe('default options', () => {
    beforeAll(async () => {
      await helpers.run(generator);
    });

    test('creates tsconfig.json file', () => {
      assert.file(['tsconfig.json']);
      assert.fileContent('tsconfig.json', '"outDir": "./dist"');
    });

    test('configures package.json', () => {
      assert.fileContent('package.json', /"typescript":/);
      assert.jsonFileContent('package.json', {
        main: 'dist/index.js',
        scripts: {
          build: 'npm run tsc',
          prepublishOnly: 'npm run test && npm run build',
          tsc: 'tsc',
        },
      });
    });
  });

  describe('change outputFolder option', () => {
    beforeAll(async () => {
      await helpers.run(generator).withOptions({ outputFolder: 'out' });
    });

    test('creates tsconfig.json file', () => {
      assert.file(['tsconfig.json']);
      assert.fileContent('tsconfig.json', '"outDir": "./out"');
    });

    test('configures package.json', () => {
      assert.fileContent('package.json', /"typescript":/);
      assert.jsonFileContent('package.json', {
        main: 'out/index.js',
      });
    });
  });

  describe('change compileInline option', () => {
    beforeAll(async () => {
      await helpers.run(generator).withOptions({ compileInline: true });
    });

    test('creates tsconfig.json file', () => {
      assert.file(['tsconfig.json']);
      assert.fileContent('tsconfig.json', '// "outDir":');
    });

    test('configures package.json', () => {
      assert.fileContent('package.json', /"typescript":/);
    });
  });
});
