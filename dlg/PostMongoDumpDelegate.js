var exec = require('child_process').exec;
var moment = require('moment-timezone');

var a = 'totoances';
var b = 'totonazzi';

exports.postDump = function(postDumpRequest) {

  return new Promise(function(success, failure) {

    if (postDumpRequest == null || postDumpRequest.env == null || postDumpRequest.env == '') {
      failure();
      return;
    }

    var dumpTS = moment().tz('Europe/Rome').format('YYYYMMDDHHmmss');
    var dumpname = 'totodump-' + dumpTS + '.tgz';

    exec('mongodump --host mongo:27017 -o /mongo-dump', function(err, stdout, stderr) {

      console.log(stdout);
      console.log(stderr);

      exec('tar -c -f ' + dumpname + ' /mongo-dump', function(err, stdout, stderr) {

        console.log(stdout);
        console.log(stderr);

        exec('mkdir /mongo-dumps; mv ' + dumpname + ' /mongo-dumps', function(err, stdout, stderr) {

          console.log(stdout);
          console.log(stderr);

          exec('cd /mongo-dumps; git init; git add ' + dumpname + '; git commit -m \'Backup\'; git push https://' + a + ':' + b + '@gitlab.com/totoances/' + postDumpRequest.env + '-mongo-dump.git;', function(err, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);

            success();
          });
        });

      });

    });

  });
}
