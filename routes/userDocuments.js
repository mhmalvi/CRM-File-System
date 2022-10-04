const express = require('express');
const router = express.Router();
const userDocuments = require('../services/userDocuments');
const multer = require('multer');
var path = require('path');
var cors = require('cors');
var md5 = require('md5');
const fs = require('fs');
 
//console.log(md5('message'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //console.log('==>> ',req.body);
        let clentId  = `${req.client_id}`;
        let userId  =  `${req.user_id}`;

       // let path = './path/to/my/directory';

        let path = `uploads/${md5(clentId)}/${md5(userId)}/logo`;
        // if (!fs.existsSync(directories)) {
        //     fs.mkdirSync(directories);
        //   }
        path.split('/').reduce(
            (directories, directory) => {
              directories += `${directory}/`;
          
              if (!fs.existsSync(directories)) {
                fs.mkdirSync(directories);
              }
          
              //return directories;
            },
            '',
          );
 
       cb(null, path);
    },
    filename: function (req, file, cb) {
       cb(null, `${path.basename(file.originalname,  path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });
  

 const upload = multer({storage:storage});

/* GET User Documents */
router.get('/', async function(req, res, next) {
  try {
    res.json(await userDocuments.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting User documents`, err.message);
    next(err);
  }
});

/* POST Documents */
router.post('/', upload.single('document_name'), async function(req, res, next) {
    //console.log(req.body);
    try {
      res.status(201).json(await userDocuments.create(req));
    } catch (err) {
      console.error(`Error while creating User Documents`, err.message);
      next(err);
    }
  });

 
module.exports = router;