function getInitialPackageJson({
  moduleName,
  projectDescription,
  license,
  name,
  email,
  url,
  homepage,
  scripts = {},
  dependencies = {},
  devDependencies = {},
}) {
  const pkgJson = {
    name: moduleName,
    version: '0.0.0',
    homepage,
    description: projectDescription,
    license,
    author: {
      name,
      email,
      url,
    },
    scripts: {
      start: 'node .',
      ...scripts,
    },
    dependencies,
    devDependencies,
  };
  return pkgJson;
}

function readPkgForGenerator(generator) {
  return generator.fs.readJSON(generator.destinationPath('package.json'), {});
}

function writePkgForGenerator(generator, pkg) {
  return generator.fs.writeJSON(generator.destinationPath('package.json'), pkg);
}

module.exports = {
  getInitialPackageJson,
  readPkgForGenerator,
  writePkgForGenerator,
};
