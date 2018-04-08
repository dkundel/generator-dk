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
      default: false,
      desc: 'Initialize project as TypeScript project',
    });

    this.option('git', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'Intiailizes a Git repo and sets the origin remote to GitHub',
    });

    this.option('scoped', {
      type: Boolean,
      required: false,
      desc: 'Use scoped package',
    });
  }

  async initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const getGitHubName = () =>
      this.user.github.username().catch(() => userInfo().username);

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repositoryName: this.options.repositoryName,
      travis: this.options.travis,
      typescript: this.options.typescript,
      defaultGithubAccount: await getGitHubName(),
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
    const defaultProjectUrl = `https://github.com/${
      this.props.defaultGithubAccount
    }/${this.props.name}`;
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
        default: this.props.defaultGithubAccount,
        when: !this.props.githubAccount,
      },
      {
        name: 'description',
        message: 'Description',
        when: !this.pkg.description,
      },
      {
        name: 'homepage',
        message: 'Project homepage url',
        default: defaultProjectUrl,
        when: !this.pkg.homepage,
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
        store: true,
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Would you like to use TypeScript?',
        when: !this.props.typescript,
        default: false,
        store: true,
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = extend(this.props, props);
    });
  }

  _copyStaticDotFiles() {
    const files = ['editorconfig', 'gitignore', 'npmrc', 'prettierrc', 'env'];

    for (const file of files) {
      this.fs.copy(this.templatePath(file), this.destinationPath(`.${file}`));
    }

    this.fs.copy(
      this.templatePath('env'),
      this.destinationPath('.env.example')
    );
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

    if (this.props.travis) {
      this.composeWith(require.resolve('generator-travis/generators/app'), {
        config: {},
      });
    }

    this.composeWith(require.resolve('../wireframe'), {
      typescript: this.props.typescript,
      type: this.props.type,
      name: this.props.name,
    });

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

    this.composeWith(require.resolve('../coc'), {
      contactEmail: this.props.authorEmail,
    });

    this.composeWith(require.resolve('../badges'), {
      moduleName: this.props.moduleName,
      githubUserName: this.props.githubAccount,
      githubProjectName: this.props.repositoryName,
      travis: this.props.travis,
      codeOfConduct: true,
      contributors: true,
      npm: this.props.type === 'module',
    });
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
      githubAccount: this.props.githubAccount,
      repositoryName: this.props.repositoryName,
      homepage: this.props.homepage,
    };

    this._copyStaticDotFiles();
    this._writeReadme(tpl);

    const pkg = getInitialPackageJson(tpl);
    extend(pkg, {
      scripts: {
        test: 'echo "No tests specified" && exit 0',
      },
    });

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
