const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Mailtest
router.get('/mailtest', forwardAuthenticated, (req, res) => res.send('mailtest'));
router.get('/file_test',forwardAuthenticated, function(req,res){
    console.log('Router didnt get here') ;
    res.redirect('pages/tests/file_test');
});

router.post('/send_message', function(req, res, next){
    if (!req.files)
      res.json('No files were uploaded.');

    let sampleFile = req.files.attach_file;

    if(sampleFile instanceof Array){
    var file_info = [];
    var count = 0;
    sampleFile.forEach(function(ele, key) {
      ele.mv(path.resolve(`./public/upload/${ele.name}`), function(err) {
        if (err){
          console.log(err);
        }else{
          file_info.push(ele.name);
        }
        count++;
        if(sampleFile.length == count){
          res.json({file_name: file_info });
        }
      });
    });
}
});

module.exports = router;