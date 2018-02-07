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
    var env = postDumpRequest.env;
    var gitFolder = '/' + env + '-mongo-dump';

    exec('mongodump --host mongo:27017 -o /mongo-dump', function(err, stdout, stderr) {

      console.log(stdout);
      console.log(stderr);

      exec('tar -c -f ' + dumpname + ' /mongo-dump', function(err, stdout, stderr) {

        console.log(stdout);
        console.log(stderr);

        exec('rm -r ' + gitFolder + '; git clone https://' + a + ':' + b + '@gitlab.com/totoances/' + postDumpRequest.env + '-mongo-dump.git; mv ' + dumpname + ' ' + gitFolder, function(err, stdout, stderr) {

          console.log(stdout);
          console.log(stderr);

          exec('cd ' + gitFolder + '; git init; git config --global user.email "toto.matteazzi@gmail.com"; git config --global user.name "totoances"; git add ' + dumpname + '; git commit -m \'Backup\'; git push --set-upstream https://' + a + ':' + b + '@gitlab.com/totoances/' + postDumpRequest.env + '-mongo-dump.git master;', function(err, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);

            success();
          });
        });

      });

    });

  });
}
