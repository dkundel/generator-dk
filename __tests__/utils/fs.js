const { resolve } = require('path');
const fs = require('fs-extra');

const FIXTURE_DIR = resolve(__dirname, '../fixtures');

function loadFileFromFixtures(dir, fixture, name) {
  const srcPath = resolve(FIXTURE_DIR, fixture, name);
  const destPath = resolve(dir, name);
  fs.copySync(srcPath, destPath);
}

function initializeFiles(fixture, files) {
  return dir => {
    files.forEach(file => {
      loadFileFromFixtures(dir, fixture, file);
    })
  }
}

module.exports = { initializeFiles };
