var app = require('express')();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var fs = require('fs');
var shellescape = require('shell-escape');

app.use(bodyParser.json());
app.get('/', function (req, res) {
    var loc=req.query.loc,
        beds=req.query.beds,
        maxPrice=req.query.max,
        minPrice=req.query.min,
        type=req.query.type,
        page=req.query.page || 1,
        domain=(req.query.domain || 'justproperty')+'.js';

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