var Controller = require('toto-api-controller');

var postMongoDumpDlg = require('./dlg/PostMongoDumpDelegate');

var api = new Controller('mongo-dump');

api.path('POST', '/dumps', (req, res) => {postMongoDumpDlg})

api.listen();
