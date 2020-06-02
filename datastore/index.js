const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, newId) => {
    //why? doesn't relative path work
    fs.writeFile(path.join(exports.dataDir, `${newId}.txt`), text, (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: newId, text: text });
      }
    })
  });
  // items[id] = text;
};

exports.readAll = (callback) => {
  //   var data = _.map(items, (text, id) => {
  //     return { id, text };
  //   });
  //   callback(null, data);
  var result = []
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      throw (err);
    } else {
      //dont think we need the callback err filename)
      // fileNames.map((err, fileName) => {
      //   if (err) {
      //     callback(err, null);
      //   } else {
      //     result.push({ id: fileName.splice(-4), text: fileName.splice(-4) });

      //   }
      //   console.log(result);
      //   callback(null , result);
      // });
      fileNames.map((filename) => {
        ;
        result.push({ id: filename.slice(0, 5), text: filename.slice(0, 5) });
      });
      // for (var i = 0; i < fileNames.length; i++) {
      //   result.push({id: fileNames[i].slice(0,5), text: fileNames[i].slice(0,5)})
      // }
      callback(null, result);
    }
  });
};


exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
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
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  // } else {
    //   callback();
    // }
    fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
      if (err) {
      callback(new Error(`No item with id: ${id}`));
      // callback(err, null);
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
