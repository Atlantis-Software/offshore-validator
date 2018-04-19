var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var cp = require('child_process');
var download = require('download-git-repo');


var Mocha = require('mocha');
var mocha = new Mocha();

(function getTestFiles(dir) {
  files = fs.readdirSync(dir);
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      return getTestFiles(path.join(dir, file));
    }
    mocha.addFile(path.join(dir, file));
  });
})(__dirname);

mocha.run(function(failures) {
  if (failures) {
    process.on('exit', function() {
      process.exit(failures);
    });
  } else {
    download('Atlantis-Software/offshore', path.join(__dirname, '..', 'offshoreTest'), function (err) {
      if (err) {
        throw err;
      }
      var offshoreInstall = cp.exec('npm install', {
        cwd: path.join(__dirname, '..', 'offshoreTest')
      });
      offshoreInstall.stderr.pipe(process.stderr);
      offshoreInstall.stdout.pipe(process.stdout);

      offshoreInstall.on('exit', function(code) {
        rimraf(path.join(__dirname, '..', 'offshoreTest', 'node_modules', 'offshore-validator'), function(err) {
          if (err) {
            throw err;
          }
          fs.symlink(path.join(__dirname, '..'), path.join(__dirname, '..', 'offshoreTest', 'node_modules', 'offshore-validator'), function(err) {
            if (err) {
              throw err;
            }
            var offshoreTest = cp.exec('npm run test', {
              cwd: path.join(__dirname, '..', 'offshoreTest')
            });
            offshoreTest.stderr.pipe(process.stderr);
            offshoreTest.stdout.pipe(process.stdout);
            offshoreTest.on('exit', function(code) {
              rimraf(path.join(__dirname, '..', 'offshoreTest'), function(err) {
                process.exit(code);
              });
            });
          });
        });
      });
    });
  }
});
