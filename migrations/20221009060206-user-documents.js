'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {

  db.createTable('user_documents', {
    id: {
      type: type.INTEGER,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: 'int',
      length: 11,
      default:0
    },
    client_id: {
      type: 'int',
      length: 11,
      default:0
    },
    document_name:{
      type: 'text',
      length: 100,
      default: null
    },
    document_details:{
      type: 'text',
      default: null
    },
    file_sizes:{
      type: 'int',
      default: null,
      comment: "Calculation only Kilo bytes (KB)"
    },
    deleted_by: {
      type: 'int',
      length: 11,
      default:0
    },
    created_at: {
      type: 'datetime',
      default: null
    },
    updated_at: {
      type: 'datetime',
     default: null
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('user_documents', callback);
};

exports._meta = {
  "version": 1
};
