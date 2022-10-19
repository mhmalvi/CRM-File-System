const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var md5 = require('md5');
const fs = require('fs'); 
const fsPromises = fs.promises;

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM user_documents LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
 
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
 


async function getOne(field, value){
    //console.log(user_id);
    //console.log('==',field);
    const rows = await db.query(
      `SELECT * FROM user_documents Where ${field} = '${value}'`
    );
    const data = helper.emptyOrRows(rows);

    //console.log(data);
    return {
      data  
    }
  }


   async function countStorage(clentId){
     
    const rows = await db.query(
      `SELECT sum(file_sizes) as total_size FROM user_documents where client_id='${clentId}';`
    );
    const data = helper.emptyOrRows(rows);

    //console.log(data);
    return {
      data  
    }
  }


async function create(req, res){
    //console.log(req);
    const requestData = req.body;
    const fileAQrray = req.file;
  
    if (!fileAQrray) {
       //return { message: 'Please upload a file.' };
       res.status(404).send({ result: 'fail', error: { message: ' Please upload a file.' } })
    }
    //console.log(fileAQrray);
    const fileName =fileAQrray.filename.replace(/\s/g, "");
    //console.log(fileName);
    //fileName.replace(/\s/g, "");
    //return {requestData};
    
    let message = req;
    try{
      const file =  `uploads/${md5(requestData.client_id)}/${md5(requestData.user_id)}/${fileName}`;
      var size = fileAQrray.size;
      var MyDate = new Date();
      const created_at = MyDate.toMysqlFormat(); //return MySQL Datetime format

      const result = await db.query(
        `INSERT INTO user_documents (user_id, client_id, document_name, document_details, file_sizes, created_at) 
        VALUES ('${requestData.user_id}', '${requestData.client_id}', '${file}', '${requestData.document_details}', '${size}', '${created_at}')`
      );

      
      if (result.affectedRows) {
        let details = await getOne('id', result.insertId);
        console.log(details);
        message = details;
      }
    
    //message = userDocuments.file;
    return {message};
    //res.status(201).send({ result: 'success', message: message  })

    }catch(error){  
      //deleteFile(file);
      res.status(400).send({ result: 'fail', error: { message: ' Parameter mismatch' } })
    }
    
  }


  const deleteFile = async (req, res, filePath) => {
      
    try {
      await fsPromises.unlink(filePath);
    
      return true;
     
    } catch (err) {
      res.status(401).send({ result: 'fail', error: { message: ' Document not found' } })
    }
    
  };

//   async function update(id, programmingLanguage){
//     const result = await db.query(
//       `UPDATE user_documents 
//       SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
//       pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
//       WHERE id=${id}` 
//     );
  
//     let message = 'Error in updating programming language';
  
//     if (result.affectedRows) {
//       message = 'Programming language updated successfully';
//     }
  
//     return {message};
//   }

  async function remove(req, res){
    var id = req.params.id;
    let message = 'Error in while deleting Documents';
    let document_name = '';
    let result = await getOne('id', id);
    if(result.data!=""){
     
      for (var key in result.data) {
        document_name = result.data[key].document_name;
      };
  
    }
    if(document_name!=""){
      if(deleteFile(req, res, document_name)){
        message = 'Documents deleted successfully';
        const result = await db.query(
             `DELETE FROM user_documents WHERE id=${id}`
           );
      }else{
        res.status(401).send({ result: 'fail', error: { message: ' Error ! Please try again' } })
      }    
       
    }else{
      res.status(401).send({ result: 'fail', error: { message: ' Document not found' } })
    }
    //console.log(document_name);
    return {message};
}

//module.exports.getMultiple = getMultiple;

module.exports = {
    getMultiple,
    getOne,
    create,
    countStorage,
    remove
   // update
  }

