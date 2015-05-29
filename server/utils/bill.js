'use strict';

var fs = require('fs');
var tesseract = require('node-tesseract');
var Promise = require("bluebird");

Promise.promisifyAll(fs);

/**
 * Initial function to start parsing bill data.
 * @param   {String}   path   Path to bill image
 * @param   {JPEG}     file   Uploaded bill image
 * @return  {Promise}         Returns parsed bill items or error
 */
exports.parse = function(path, file, billName) {
  return new Promise(function(resolve, reject) {
    readFile(file)
    .then(function(data) {
      return writeFile(path, data);
    })
    .then(function() {
      return process(path, billName);
    })
    .then(function(text) {
      resolve(text);
    })
    .catch(function(err) {
      reject(err);
    })
    .done();
  });
};

/**
 * Reads bill image file from Formidable
 * @param   {JPEG}     file   Uploaded bill image
 * @return  {Promise}         Returns parsed bill items or error
 */
var readFile = function(file) {
  return fs.readFileAsync(file)
  .then(function(data) {
    return data;
  })
  .catch(function(err) {
    return err;
  });
}

/**
 * Writes to bill image to disk.
 * @param   {String}   path   Path to bill image
 * @param   {JPEG}     file   Uploaded bill image
 * @return  {Promise}         Returns parsed bill items or error
 */
var writeFile = function(path, file) {
  return fs.writeFileAsync(path, file)
  .then(function() {
    return;
  })
  .catch(function(err) {
    return err;
  });
}

/**
 * Process bill items to JSON object
 * @param   {JPEG}     file   Uploaded bill image
 * @return  {Promise}         Returns parsed bill items or error
 */
var process = function(path, billName) {
  return new Promise(function(resolve, reject) {
    tesseract.process(path, function(err, text) {
      if (err) {
        reject(err);
      } else {
        var bill = require('../api/bill/model').billModel();
        bill.billName = billName;
        bill.diners.push({diner: billName, itemIndex: []});      
        
        postProcess(bill, text)
        resolve(bill);
      }
    });
  });
}

/**
 * Initializes bill processing. 
 * Kicks off functions to find ordered items and totals.
 * @param   {String}  text   Bill object
 * @param   {Array}   item   Line item of bill text
 * @param   {Float}   cost   Cost of line item
 */
var postProcess = function(bill, text) {
  var receipt = text.split('\n');
  var costRegex = /^\$?\d+(,\d{3})*(\.\d*)?.?$/;
  
  for (var i = 0; i < receipt.length; i++) {
    var item = receipt[i].split(' ');
    var cost = item.pop();
    
    //continue if line doesn't have a cost
    if (cost.search(costRegex) < 0) {
      continue;
    }

    cost = parseFloat(cost);

    //assume ordered item if first element is a number
    if (!isNaN(item[0])) {
      parseItems(bill, item, cost);
      continue;
    } 

    //assume total if cost and first element is not a number 
    parseTotals(bill, item, cost);
    console.log('i: ', i);
  }  

  checkTotals(bill);

  return bill;
}

/**
 * Parse receipt for ordered items.
 * @param   {Object}  bill   Bill object
 * @param   {Array}   item   Line item of bill text
 * @param   {Float}   cost   Cost of line item
 */
var parseItems = function(bill, item, cost) {
  var quanity = parseInt(item.shift());

  while(quanity--) {
    bill.receipt.items.push({
      description: item.join(' '),
      cost: cost
    });
  }
}

/**
 * Parse receipt for subTotal, tax, and total.
 * @param   {Object}  bill   Bill object
 * @param   {Array}   item   Line item of bill text
 * @param   {Float}   cost   Cost of line item
 */
var parseTotals = function(bill, item, cost) {
  var itemString = item.join('').toLowerCase();
  
  //check for 'sub' must come before 'total'
  if (itemString.indexOf('sub') !== -1) {
    bill.receipt.subTotal = cost;
  }

  if (itemString.indexOf('tax') !== -1) {
    bill.receipt.tax = cost;
  }

  if (itemString.indexOf('total') !== -1) {
    bill.receipt.total = cost;
  }
}

/**
 * Sanity check for totals before returning the constructed bill object.
 * @param   {Object}   bill   Bill object
 */
var checkTotals = function(bill) {
  var receipt = bill.receipt;

  if (receipt.subTotal && receipt.tax && !receipt.total) {
    receipt.total = Number((receipt.subTotal + receipt.tax).toFixed(2));
  }

  if (receipt.subTotal + receipt.tax !== receipt.total) {
    // error;
  }

  if (receipt.total - receipt.tax !== receipt.subTotal) {
    // error;
  }
}
