var exec = require('child_process').exec;
var moment = require('moment-timezone');

var a = 'totoances';
var b = 'totonazzi';

exports.do = function(req) {

  postDumpRequest = req.body;

  return new Promise(function(success, failure) {

    var dumpTS = moment().tz('Europe/Rome').format('YYYYMMDDHHmmss');

    console.log('[' + dumpTS + '] - Mongo Dump requested. Environment: ' + postDumpRequest.env);

    if (postDumpRequest == null || postDumpRequest.env == null || postDumpRequest.env == '') {
      failure();
      return;
    }

    console.log('[' + dumpTS + '] - Starting Mongo Dump');

    var dumpname = 'totodump-' + dumpTS + '.tgz';
    var env = postDumpRequest.env;
    var gitFolder = '/' + env + '-mongo-dump';

    console.log('[' + dumpTS + '] - Git folder : ' + gitFolder);
    console.log('[' + dumpTS + '] - Executing mongodump');

    exec('mongodump --host mongo --port 27017 -o /mongo-dump', function(err, stdout, stderr) {

      console.log('[' + dumpTS + '] - mongodump executed');

      console.log(stdout);

      console.log('[' + dumpTS + '] - Creating tar of ' + dumpname);

      if (err) {
        console.log(err);
        failure(err);
        return;
      }

      exec('tar -c -f ' + dumpname + ' /mongo-dump', function(err, stdout, stderr) {

        console.log('[' + dumpTS + '] - tar created');

        console.log(stdout);
        console.log(stderr);

        console.log('[' + dumpTS + '] - Cloning git folder: ' + gitFolder);

        exec('rm -rf ' + gitFolder + '; git clone https://' + a + ':' + b + '@gitlab.com/totoances/' + postDumpRequest.env + '-mongo-dump.git; mv ' + dumpname + ' ' + gitFolder, function(err, stdout, stderr) {

          console.log('[' + dumpTS + '] - Git folder cloned');

          console.log(stdout);
          console.log(stderr);

          console.log('[' + dumpTS + '] - Committing updated git folder');

          exec('cd ' + gitFolder + '; git init; git config --global user.email "toto.matteazzi@gmail.com"; git config --global user.name "totoances"; git add ' + dumpname + '; git commit -m \'Backup\'; git push --set-upstream https://' + a + ':' + b + '@gitlab.com/totoances/' + postDumpRequest.env + '-mongo-dump.git master;', function(err, stdout, stderr) {

            console.log('[' + dumpTS + '] - Git folder committed');

            console.log(stdout);
            console.log(stderr);

            success({filename: dumpname});
          });
        });

      });

    });

  });
}
