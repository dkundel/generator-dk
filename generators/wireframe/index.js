const Generator = require('yeoman-generator');
const extend = require('deep-extend');
const camelCase = require('lodash.camelcase');

const { readPkgForGenerator, writePkgForGenerator } = require('../utils');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Your module name',
    });

    this.option('typescript', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Create TypeScript files',
    });

    this.option('type', {
      type: String,
      required: false,
      default: 'node',
      desc: 'The type of project',
    });
  }

  initialize() {
    this.props = extend({}, this.options);
    if (this.options.module) {
      this.props.type = 'module';
    }

    if (this.options.cli) {
      this.props.type = 'cli';
    }
  }

  _getConfigForNodeProject() {
    const dependencies = {
      'if-env': '^1.0.4',
    };
    const devDependencies = {
      'node-env-run': '^3.0.2',
    };

    const scripts = {};
    scripts.start =
      'if-env NODE_ENV=production && npm run start:prod || npm run start:dev';
    scripts['start:prod'] = 'node .';
    scripts['start:dev'] = 'nodenv .';

    if (this.props.typescript) {
      scripts['start:dev'] = 'nodenv index.ts --exec "ts-node"';
      devDependencies['ts-node'] = '^5.0.1';
    }

    return { scripts, devDependencies, dependencies };
  }

  _createEntryFiles() {
    const ext = this.props.typescript ? 'ts' : 'js';
    const name = camelCase(this.props.name);
    if (this.props.type === 'node') {
      this.fs.copyTpl(
        this.templatePath('node.js'),
        this.destinationPath(`index.${ext}`),
        { name }
      );
    } else {
      this.fs.copyTpl(
        this.templatePath(`module.${ext}`),
        this.destinationPath(`index.${ext}`),
        { name }
      );
    }

    if (this.props.type === 'cli') {
      this.fs.copyTpl(
        this.templatePath(`cli.${ext}`),
        this.destinationPath(`cli.${ext}`),
        { name }
      );
    }
  }

  _updatePackageJson() {
    const pkg = readPkgForGenerator(this);
    pkg.main = 'index.js';
    if (this.props.type === 'cli') {
      const tsDeps = this.props.typescript ? { '@types/meow': '^4.0.1' } : {};
      extend(pkg, {
        bin: 'cli.js',
        dependencies: {
          meow: '^4.0.0',
          ...tsDeps,
        },
      });
    }

    if (this.props.type === 'node') {
      extend(pkg, this._getConfigForNodeProject());
    }

    writePkgForGenerator(this, pkg);
  }

  writing() {
    this._createEntryFiles();
    this._updatePackageJson();
  }
};
