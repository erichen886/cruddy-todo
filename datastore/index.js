const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
var fsPromise = Promise.promisify(fs.readFile);
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, newId) => {
    fs.writeFile(path.join(exports.dataDir, `${newId}.txt`), text, (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: newId, text: text });
      }
    })
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      throw (err);
    } else {
      var result = _.map(fileNames, (filename) => {
       return fsPromise(path.join(exports.dataDir, filename),'utf8').then ((text) => {
          return { id: filename.slice(0, 5), text: text };
        })
      });
      Promise.all(result).then((result) => {
        console.log(result)
        callback(null, result);
      })
      .catch((err)=>{
        callback(err, '=)' )
      })
    }
  });
};


exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, "utf8", (err) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
