const Generator = require('yeoman-generator');
const { stripIndent } = require('common-tags');
const extend = require('lodash.defaultsdeep');
const { readPkgForGenerator, writePkgForGenerator } = require('../utils');

const CONTRIBUTORS_README = stripIndent`
  Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

  <!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

  <!-- ALL-CONTRIBUTORS-LIST:END -->

  This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
`;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('githubAccount', {
      type: String,
      required: true,
      desc: 'GitHub username of creator',
    });
    this.option('projectName', {
      type: String,
      required: true,
      desc: 'Name of the project',
    });
  }

  writing() {
    let readmeMd = this.fs.read(this.destinationPath('README.md'));
    readmeMd = readmeMd.replace(
      '<!-- Insert contributors -->',
      CONTRIBUTORS_README
    );
    this.fs.write(this.destinationPath('README.md'), readmeMd);

    const pkg = readPkgForGenerator(this);
    extend(pkg, {
      devDependencies: {
        'all-contributors-cli': '^4.11.1',
      },
      scripts: {
        'contrib:add': 'all-contributors add',
        'contrib:gen': 'all-contributors generate',
      },
    });
    writePkgForGenerator(this, pkg);

    this.fs.copyTpl(
      this.templatePath('all-contributorsrc'),
      this.destinationPath('.all-contributorsrc'),
      {
        projectName: this.options.projectName,
        githubAccount: this.options.githubAccount,
      }
    );
  }

  end() {
    this.spawnCommandSync('npx', [
      'all-contributors',
      'add',
      this.options.githubAccount,
      'code,design,ideas,review,doc',
    ]);
  }
};
