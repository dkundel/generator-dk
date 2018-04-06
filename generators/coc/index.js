const Generator = require('yeoman-generator');

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
    this.fs.copyTpl(
      this.templatePath('CODE_OF_CONDUCT.md'),
      this.destinationPath('CODE_OF_CONDUCT.md'),
      {
        contactEmail: this.options.contactEmail,
      }
    );
  }
};
