const express = require('express');
const router = express.Router();
const userDocuments = require('../services/userDocuments');
const multer = require('multer');
var path = require('path');
var cors = require('cors');
var md5 = require('md5');
const fs = require('fs');




//var maxSize =  1024 * 1024;

//var maxSize =  10;
// Default Size 1024 * 1024 for a client

var storage = multer.diskStorage({
    destination:  function (req, file, cb) {
        //console.log('==>> ',req.body);
        if(req.body.client_id && req.body.user_id){
          let clientId  = `${req.body.client_id}`;
          let userId  =  `${req.body.user_id}`;

          // Check File size 
             const fileSize= parseInt(req.headers["content-length"]);

         // let total_size = userDocuments.countStorage(clientId);
           
         const totalSize = userDocuments.countStorage(clientId);
         var totalStorges = [];
        
          totalSize.then(function(result) {
           
            //console.log('hhhh',result.data) // "Some User token"

            var sizes = 0;
            for (var key in result.data) {
              sizes = sizes + result.data[key].total_size;
              //console.log(' size =' + result.data[key].total_size);
            };

            //console.log('sizes', sizes)

            let defaultStorages = 1024 * 1024;   // Default Per User

            //let defaultStorages = 166200;   // Default Per User

            let calculateSize = defaultStorages - sizes ;
            if(calculateSize>0){
              if(fileSize>calculateSize){
                const error = new Error('File is too big');
                cb(error,'File is too big')
  
              }else{
  
                var dir = `./uploads/${md5(clientId)}/${md5(userId)}`;
      
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir, { recursive: true });
                }
        
               cb(null, dir);
  
              }
              
            }else{
              const error = new Error('You have no sufficient storage for uploading this file');
              cb(error,'')
            }
                
          })
       
          // EOF Check File size
          
        }else{
          const error = new Error('User Id or Client Id not found');
          cb(error,'')
        }
       
    },
    filename: function (req, file, cb) {
       //console.log('hi', req.body);
       cb(null, `${path.basename(file.originalname,  path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });

 const upload = multer({
  storage: storage
})
  
//  const upload = multer({
//   storage: storage,
//   limits: { fileSize: maxSize }
// })

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
router.post('/',  upload.single('document_name'), async function(req, res, next) {
    //console.log('==',req.body);
    try {
      res.status(201).json(await userDocuments.create(req,res));
    } catch (err) {
      console.error(`Error while creating User Documents`, err.message);
      next(err);
    }
  });

 
module.exports = router;