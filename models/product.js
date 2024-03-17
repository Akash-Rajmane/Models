const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, return an empty array
        return cb([]);
      } else {
        // Other error occurred, log and return an empty array
        console.error('Error reading file:', err);
        return cb([]);
      }
    }

    if (!fileContent.length) {
      // File exists but is empty, return an empty array
      return cb([]);
    }

    try {
      const products = JSON.parse(fileContent);
      cb(products);
    } catch (error) {
      // Error parsing JSON, log and return an empty array
      console.error('Error parsing JSON:', error);
      cb([]);
    }
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        if (err) {
          console.error('Error writing file:', err);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
