var express = require('express');
var router = express.Router();
var sh = require('shelljs');
var fs = require('fs');
var path = require('path');

function annotateFolder (folderPath) {
  var count = 0;
  sh.cd(folderPath);
  var files = sh.ls() || [];

  for (var i=0; i<files.length; i++) {
    var file = files[i];

    if (!file.match(/.*\..*/)) {
      annotateFolder(file);
      sh.cd('../');
    } else {
      count++;
    }
  }
  
  return(count);
}

var count = annotateFolder("problems");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Calculator' });
});

/* GET home page. */
router.get('/calc', function(req, res, next) {
  res.render('calc', { title: 'Calculator Modal' });
});

// router.get('/week', function(req, res, next) {
//   res.render('week', { title: 'Homework', problems: probdata, weeks: count });
// });

function jsonRead (filePath, callback) {
  var probdata;
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err){
      probdata = JSON.parse(data);
      callback(probdata, false);
    } else{
      callback(err, true);
    }
  });
}

router.get('/week/:weekId', function(req, res) {
  var filePath = path.join(__dirname, '../problems/'+req.params.weekId+'.json');
  jsonRead(filePath, function(result, error) {
    if (error != true) {
      res.render("week", { title: 'Homework', problems: result, weeks: count, week: req.params.weekId });
    } else {
      res.sendStatus(404);
    }
  });
});


module.exports = router;
