var exec = require('child_process').exec;

exports.postDump = function() {

  return new Promise(function(success, failure) {

    exec('mongodump --host mongo:27017', function(err, stdout, stderr) {

      console.log(stdout);
      console.log(stderr);
      console.log(err);

      success();

    });

  });
}
