const Generator = require('yeoman-generator');
const { stripIndent } = require('common-tags');

const REGEX_BADGES = /<!-- BADGES:START -->(.|\s)*?<!-- BADGES:END -->/i;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('moduleName', {
      required: true,
      type: String,
      desc: 'Name as specified in package.json',
    });

    this.option('githubAccount', {
      required: true,
      type: String,
      desc: 'GitHub username',
    });

    this.option('repositoryName', {
      required: true,
      type: String,
      desc: 'GitHub project name',
    });

    ['travis', 'codeOfConduct', 'npm', 'contributors'].forEach(optName => {
      this.option(optName, {
        type: Boolean,
        required: false,
        default: true,
        desc: `Should place ${optName} badge`,
      });
    });
  }

  _hasNoConditionOrOptionIsTrue({ condition }) {
    if (condition === undefined) {
      return true;
    }
    return this.options[condition];
  }

  writing() {
    const { moduleName, githubAccount, repositoryName } = this.options;
    const badges = [
      {
        link: `https://npmjs.com/packages/${moduleName}`,
        imgSrc: `https://img.shields.io/npm/v/${moduleName}.svg?style=flat-square`,
        altText: 'npm',
        condition: 'npm',
      },
      {
        link: `https://npmjs.com/packages/${moduleName}`,
        imgSrc: `https://img.shields.io/npm/dt/${moduleName}.svg?style=flat-square`,
        altText: 'npm',
        condition: 'npm',
      },
      {
        link: `https://travis-ci.org/${githubAccount}/${repositoryName}`,
        imgSrc: `https://img.shields.io/travis/${githubAccount}/${repositoryName}.svg?branch=master&style=flat-square`,
        altText: 'Build Status',
        condition: 'travis',
      },
      {
        link: '#contributors',
        imgSrc:
          'https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square',
        altText: 'All Contributors',
        condition: 'contributors',
      },
      {
        link: 'CODE_OF_CONDUCT.md',
        imgSrc:
          'https://img.shields.io/badge/%F0%9F%92%96-Code%20of%20Conduct-ff69b4.svg?style=flat-square',
        altText: 'Code of Conduct',
        condition: 'codeOfConduct',
      },
      {
        link: 'https://github.com/prettier/prettier',
        imgSrc:
          'https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square',
        altText: 'code style: prettier',
      },
    ];
    const readmeMd = this.fs.read(this.destinationPath('README.md'));
    const badgesMd = badges
      .filter(this._hasNoConditionOrOptionIsTrue.bind(this))
      .map(({ link, imgSrc, altText }) => `[![${altText}](${imgSrc})](${link})`)
      .join('');
    const badgesWrapped = stripIndent`
      <!-- BADGES:START -->
      ${badgesMd}
      <!-- BADGES:END -->`;
    const newReadmeMd = readmeMd.replace(REGEX_BADGES, badgesWrapped);
    this.fs.write(this.destinationPath('README.md'), newReadmeMd);
  }
};
