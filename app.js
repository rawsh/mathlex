var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var routes = require('./routes/index');
var answers = require('./routes/index');

var app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

app.use('/remodal', express.static(__dirname + '/node_modules/remodal/src/'));

app.use('/', routes);
                            
app.post('/checkanswers', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log(req.body);
  
  var fs = require('fs');
  var path = require('path');
  
  var filePath = path.join(__dirname, '/problems/'+req.body.week+'.json');
  var probdata;
  
  console.log(filePath);
  
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (!err){
        probdata = JSON.parse(data);
        console.log(req.body.problem);
        var answer = probdata[req.body.problem - 1].answer + "\n";
        if (answer == req.body.solution) {
          res.send("Correct!");
        } else {
          res.send("Check your work and try again.");
        }
      }else{
        res.send("There is an error, please contact a teacher.");
        console.log(err);
      }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

app.listen(process.env.PORT, process.env.IP);