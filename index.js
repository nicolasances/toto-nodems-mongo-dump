var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");
var logger = require('toto-apimon-events')

var postMongoDumpDlg = require('./dlg/PostMongoDumpDelegate');

var apiName = 'mongo-dump';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, GoogleIdToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});
app.post('/dumps', function(req, res) {logger.apiCalled(apiName, '/dumps', 'POST', req.query, req.params, req.body); postMongoDumpDlg.postDump().then(function(result) {res.send(result);});});

app.listen(8080, function() {
  console.log('Mongo Dump Microservice up and running');
});
