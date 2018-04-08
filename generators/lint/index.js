'use strict';
const Generator = require('yeoman-generator');
const extend = require('lodash.defaultsdeep');
const { readPkgForGenerator, writePkgForGenerator } = require('../utils');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('typescript', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Load configs for TypeScript',
    });
  }

  writing() {
    const pkg = readPkgForGenerator(this);
    const eslintConfigVersion = '^2.0.0';
    const tsConfig = this.options.typescript
      ? { '@dkundel/eslint-config-ts': eslintConfigVersion }
      : {};
    extend(pkg, {
      devDependencies: {
        eslint: '^4.19.1',
        '@dkundel/eslint-config-js': eslintConfigVersion,
        ...tsConfig,
      },
      scripts: {
        lint: 'eslint "!(node_modules)/**/*.{js,ts}"',
        pretest: 'npm run lint',
      },
    });
    pkg.scripts = {
      lint: 'eslint "!(node_modules)/**/*.{js,ts}"',
      pretest: 'npm run lint',
      ...pkg.scripts,
    };
    writePkgForGenerator(this, pkg);

    this.fs.copyTpl(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc'),
      this.options
    );
    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );
  }
};
