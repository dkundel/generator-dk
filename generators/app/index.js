'use strict';
const Generator = require('yeoman-generator');
const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');
const parseAuthor = require('parse-author');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const { basename } = require('path');
const { userInfo } = require('os');
const { getInitialPackageJson } = require('../utils');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      required: false,
      desc: 'Project name',
      default: basename(process.cwd()),
    });

    this.option('travis', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include travis config',
    });

    this.option('boilerplate', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Include boilerplate files',
    });

    this.option('cli', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Add a CLI',
    });

    this.option('module', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Should be a module',
    });

    this.option('typescript', {
      type: Boolean,
      required: false,
      defaults: false,
      desc: 'Initialize project as TypeScript project',
    });

    this.option('git', {
      type: Boolean,
      required: false,
      defaults: true,
      desc: 'Intiailizes a Git repo and sets the origin remote to GitHub',
    });

    this.option('scoped', {
      type: Boolean,
      required: false,
      desc: 'Use scoped package',
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repositoryName: this.options.repositoryName,
      travis: this.options.travis,
      typescript: this.options.typescript,
      githubAccount: userInfo().username,
      license: this.pkg.license || 'MIT',
    };

    if (this.options.name) {
      if (this.options.name === '.') {
        this.options.name = basename(process.cwd());
      }
      this.props.name = kebabCase(this.options.name);
    }

    if (this.options.module) {
      this.props.type = 'module';
    }

    if (this.options.cli) {
      this.props.type = 'cli';
    }

    if (typeof this.pkg.author === 'object') {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (typeof this.pkg.author === 'string') {
      const info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  prompting() {
    const prompts = [
      {
        name: 'name',
        message: 'Your project name',
        when: !this.props.name,
        default: basename(process.cwd()),
        transformer: name => kebabCase(name),
      },
      {
        name: 'githubAccount',
        message: 'GitHub username',
        store: true,
        default: this.props.githubAccount,
      },
      {
        name: 'description',
        message: 'Description',
        when: !this.props.description,
      },
      {
        name: 'homepage',
        message: 'Project homepage url',
        when: !this.props.homepage,
      },
      {
        name: 'authorName',
        message: 'Your name',
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true,
      },
      {
        name: 'authorEmail',
        message: `Your Email`,
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true,
      },
      {
        name: 'authorUrl',
        message: `Your Homepage`,
        when: !this.props.authorUrl,
        store: true,
      },
      {
        name: 'type',
        type: 'list',
        message: 'Project type',
        when: !this.props.type,
        choices: ['node', 'module', 'cli'],
        default: 'node',
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Would you like to use TypeScript?',
        when: !this.props.typescript,
        default: false,
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = extend(this.props, props);
    });
  }

  _copyStaticDotFiles() {
    const files = ['editorconfig', 'gitignore', 'npmrc', 'prettierrc'];

    for (const file of files) {
      this.fs.copy(this.templatePath(file), this.destinationPath(`.${file}`));
    }
  }

  _writeReadme(tpl) {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      tpl
    );
  }

  default() {
    this.props.moduleName = this.props.scoped
      ? `@${this.props.githubAccount}/${this.props.name}`
      : this.props.name;
    this.props.repositoryName = this.props.name;

    if (this.options.git) {
      this.composeWith(require.resolve('generator-node/generators/git'), {
        githubAccount: this.props.githubAccount,
        repositoryName: this.props.repositoryName,
      });
    }

    this.composeWith(require.resolve('../lint'), {
      typescript: this.props.typescript,
    });

    this.composeWith(require.resolve('generator-license/app'), {
      name: this.props.authorName,
      email: this.props.authorEmail,
      website: this.props.authorUrl,
    });

    if (this.props.typescript) {
      this.composeWith(require.resolve('../typescript'), {});
    }

    this.composeWith(require.resolve('../contributors'), {
      githubAccount: this.props.githubAccount,
      projectName: this.props.repositoryName,
    });

    if (this.props.name !== basename(process.cwd())) {
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
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

  writing() {
    const tpl = {
      moduleName: this.props.moduleName,
      projectDescription: this.props.description,
      license: this.props.license,
      type: this.props.type,
      travis: this.props.travis,
      useContributors: true,
      name: this.props.authorEmail,
      email: this.props.authorEmail,
      url: this.props.authorUrl,
    };

    this._copyStaticDotFiles();
    this._writeReadme(tpl);
    this._createEntryFiles();

    const pkg = getInitialPackageJson(tpl);
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

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
