const express = require('express');
const router = express.Router();
const programmingLanguages = require('../services/programmingLanguage');
const multer = require('multer');
var path = require('path');
var cors = require('cors');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });
  

 const upload = multer({storage:storage});



// // handle single file upload
// app.post('/upload-avatar', upload.single('dataFile'), (req, res, next) => {
//     const file = req.file;
//     if (!file) {
//        return res.status(400).send({ message: 'Please upload a file.' });
//     }
//     var sql = "INSERT INTO `file`(`name`) VALUES ('" + req.file.filename + "')";
//     var query = db.query(sql, function(err, result) {
//         return res.send({ message: 'File is successfully.', file });
//      });
//  });


/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

/* POST programming language */
router.post('/', upload.single('dataFile'), async function(req, res, next) {
    //console.log(req.file.filename);
    try {
      res.status(201).json(await programmingLanguages.create(req.body, req.file.filename));
    } catch (err) {
      console.error(`Error while creating programming language`, err.message);
      next(err);
    }
  });

 /* PUT programming language */
router.put('/:id', async function(req, res, next) {
    try {
      res.json(await programmingLanguages.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating programming language`, err.message);
      next(err);
    }
  });

 /* DELETE programming language */
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await programmingLanguages.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting programming language`, err.message);
      next(err);
    }
  });

module.exports = router;