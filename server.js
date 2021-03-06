var app = require('express')();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var fs = require('fs');
var shellescape = require('shell-escape');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.get('/', function (req, res) {
    var loc=req.query.loc,
        beds=req.query.beds,
        maxPrice=req.query.max,
        minPrice=req.query.min,
        type=req.query.type,
        page=req.query.page || 1,
        uri=req.query.uri,
        domain=(req.query.domain || 'propertyfinder')+'.js';
    var args = [
        'casperjs',
        domain
    ];
   if(loc)
    args.push('--loc="'+loc+'"');
   if(beds)
    args.push('--beds="'+beds+'"');
  if(minPrice)
    args.push('--minPrice="'+minPrice+'"');
  if(maxPrice)
    args.push('--maxPrice="'+maxPrice+'"');
  if(type)
    args.push('--type="'+type+'"');
  if(type)
    args.push('--page="'+page+'"');
  if(uri)
    args.push('--uri="'+uri+'"');

    var cmd = args.join(" ");

    exec(cmd, function (error, stdout) {
        if(error) console.log(error);
        res.end(stdout);
    });

});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});