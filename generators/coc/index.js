const Generator = require('yeoman-generator');
const { stripIndent } = require('common-tags');

const COC_README_TEXT = stripIndent`
  Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md).
  By participating in this project you agree to abide by its terms.`;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('contactEmail', {
      type: String,
      required: true,
      desc: 'Email that should be mentioned in CoC',
    });
  }

  writing() {
    let readme = this.fs.read(this.destinationPath('README.md'));
    readme = readme.replace('<!-- Insert CoC notice -->', COC_README_TEXT);
    this.fs.write(this.destinationPath('README.md'), readme);

    this.fs.copyTpl(
      this.templatePath('CODE_OF_CONDUCT.md'),
      this.destinationPath('CODE_OF_CONDUCT.md'),
      {
        contactEmail: this.options.contactEmail,
      }
    );
  }
};
