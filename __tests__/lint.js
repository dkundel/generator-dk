const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const generator = require.resolve('../generators/lint');

describe('generator-dk:lint', () => {
  it('installs correct dependencies', async () => {
    await helpers.run(generator);
    assert.fileContent('package.json', /"eslint":/);
    assert.fileContent('package.json', /"@dkundel\/eslint-config-js":/);
    assert.jsonFileContent('package.json', {
      scripts: {
        pretest: 'npm run lint',
        lint: 'eslint "!(node_modules)/**/*.{js,ts}"',
      },
    });
  });

  it('creates the correct config', async () => {
    await helpers.run(generator);
    assert.file('.eslintrc');
    assert.file('.eslintignore');

    assert.jsonFileContent('.eslintrc', {
      extends: ['@dkundel/js', '@dkundel/js/jest'],
    });
  });

  it('respects typescript option', async () => {
    await helpers.run(generator).withOptions({ typescript: true });
    assert.fileContent('package.json', /"eslint":/);
    assert.fileContent('package.json', /"@dkundel\/eslint-config-js":/);
    assert.fileContent('package.json', /"@dkundel\/eslint-config-ts":/);
    assert.jsonFileContent('.eslintrc', {
      extends: ['@dkundel/js', '@dkundel/ts', '@dkundel/js/jest'],
    });
  });
});
