const Generator = require('yeoman-generator');
const { join } = require('path');
const extend = require('lodash.defaultsdeep');
const { readPkgForGenerator, writePkgForGenerator } = require('../utils');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('outputFolder', {
      type: String,
      required: false,
      default: 'dist',
      desc: 'Folder to place output of TypeScript compiler',
    });
    this.option('compileInline', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Overrides outputFolder and instead places all files side by side.',
    });
  }

  _writeTsConfig() {
    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );
  }

  writing() {
    this._writeTsConfig();
    const pkg = readPkgForGenerator(this);

    extend(pkg, {
      devDependencies: {
        typescript: '^2.8.1',
      },
      scripts: {
        build: 'npm run tsc',
        tsc: 'tsc',
        prepublishOnly: 'npm run test && npm run build',
      },
    });

    if (!this.options.compileInline) {
      pkg.main = join(this.options.outputFolder, pkg.main);
      if (typeof pkg.bin === 'string') {
        pkg.bin = join(this.options.outputFolder, pkg.bin);
      }
    }

    writePkgForGenerator(this, pkg);
  }
};
