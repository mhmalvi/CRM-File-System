const express = require('express');
const router = express.Router();
const userDocuments = require('../services/userDocuments');
const multer = require('multer');
var path = require('path');
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

            let defaultStorages = 1048576 * 100;   // 1 GB  Default Per User

            let calculateSize = defaultStorages - sizes ;
            
            //console.log(fileSize, calculateSize)
            if(calculateSize>0){
              if(fileSize>calculateSize){
                
                //const error = new Error('File is too big');
                cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
              
               return;
  
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
       cb(null, `${path.basename(file.originalname.replace(/\s/g, ""),  path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });

 const upload = multer({
  storage: storage
}).single('document_name');
  
//  const upload = multer({
//   storage: storage,
//   limits: { fileSize: maxSize }
// })

/* GET User Documents */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await userDocuments.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting User documents`, err.message);
//     next(err);
//   }
// });

/* GET User Documents */
router.get('/:id', async function(req, res, next) {
  //console.log('==',req.params.id);
  try {
    res.json(await userDocuments.getOne('id', req.params.id));
  } catch (err) {
    console.error(`Error while getting User documents`, err.message);
    next(err);
  }
});

/* POST Documents */
router.post('/',  async function(req, res, next) {
    //console.log('==',req.body);
    upload(req, res, (err) => {
      if (err) {
        console.log(err.code);
        if (err.code === 'LIMIT_FILE_SIZE') {    
          next(err);
        } 
      } else{
        try {
          userDocuments.create(req,res).then(function(result){
            res.status(201).json(result);
          });
          
        } catch (err) {
          console.error(`Error while creating User Documents`, err.message);
          next(err);
        }

      }     
    });
   
  });

  /* Delete  User Documents */
router.delete('/delete/:id', async function (req, res, next) {
  //var id = req.params.id;
  //console.log(id);
  //res.status(200).json(await userDocuments.remove(req, res));
   try {
     res.status(200).json(await userDocuments.remove(req, res));
   } catch (err) {
     console.error(`Error while deleting User documents`, err.message);
     next(err);
   }
});

// router.delete('/delete/:id', function (req, res) {
//      var id = req.params.id;
//     console.log("in delete"+ id);
//     //db.contactlist.remove({id : mongojs.ObjectId(id)}, function ( err , doc){
//     //res.json(doc);
//   //});
//  });
 
module.exports = router;