var orderSystem = require('./../purchaseOrder.js');
var chai = require('chai');
var expect = chai.expect;


describe('getAgeFactor', function () {
  describe('Equivilence classes', function () {
    it('should return -1 for an age outisde the range', function () {
      expect(orderSystem.getAgeFactor({age: -1})).to.equal(-1);
      expect(orderSystem.getAgeFactor({age: 101})).to.equal(-1);
    });

    it('should return 1 if the age is 0', function () {
      expect(orderSystem.getAgeFactor({age: 0})).to.equal(1);
    });

    it('should return 5 for ages between 0 and 2, exclusive', function() {
      expect(orderSystem.getAgeFactor({age: 1})).to.equal(5);
    });

    it('should return 10 for ages between 2 and 5', function () {
      expect(orderSystem.getAgeFactor({age: 3})).to.equal(10);
    });

    it('should return 20 for ages between 5 and 10', function () {
      expect(orderSystem.getAgeFactor({age: 6})).to.equal(20);
    });

    it('should return 50 for ages between 10 and 100', function () {
      expect(orderSystem.getAgeFactor({age: 44})).to.equal(50);
      expect(orderSystem.getAgeFactor({age: 78})).to.equal(50);
    });
  });

  describe('Boundaries values', function () {
    it('should return 10 when age is 2', function () {
      expect(orderSystem.getAgeFactor({age: 2})).to.equal(10);
    });

    it('should return 20 when age is 5', function () {
      expect(orderSystem.getAgeFactor({age: 5})).to.equal(20);
    });

    it('should return 50 when age is 10', function () {
      expect(orderSystem.getAgeFactor({age: 10})).to.equal(50);
    });

    it('should return 50 when age is 100', function () {
      expect(orderSystem.getAgeFactor({age: 100})).to.equal(50);
    });

    it('should return undefined if no age is provided', function () {
      expect(orderSystem.getAgeFactor()).to.equal(undefined);
    });
  });
});

describe('getBalanceFactor', function () {

  describe('Equivilence classes', function () {
    it('should return -1 if balance is out of range', function () {
      expect(orderSystem.getBalanceFactor({balance: -101})).to.equal(-1);
      expect(orderSystem.getBalanceFactor({balance: 1000000001})).to.equal(-1);
    });

    it('should return 6 if balance is between -100 and 0 inclusive', function () {
      expect(orderSystem.getBalanceFactor({balance: -40})).to.equal(6);
      expect(orderSystem.getBalanceFactor({balance: -90})).to.equal(6);
    });

    it('should return 16 if balance is between 0 and a thousand exclusive', function () {
      expect(orderSystem.getBalanceFactor({balance: 10})).to.equal(16);
      expect(orderSystem.getBalanceFactor({balance: 900})).to.equal(16);
    });

    it('should return 30 if balance is between 1k and 50k', function () {
      expect(orderSystem.getBalanceFactor({balance: 1500})).to.equal(30);
      expect(orderSystem.getBalanceFactor({balance: 2304})).to.equal(30);
    });

    it('should return 70 if balance is between 50k and 100k', function () {
      expect(orderSystem.getBalanceFactor({balance: 55000})).to.equal(70);
      expect(orderSystem.getBalanceFactor({balance: 78008})).to.equal(70);
    });

    it('should return 200 if balance is between 100k and a million', function () {
      expect(orderSystem.getBalanceFactor({balance: 105000})).to.equal(200);
      expect(orderSystem.getBalanceFactor({balance: 900030})).to.equal(200);
    });

    it('should return 500 if balance is greater than a million', function () {
      expect(orderSystem.getBalanceFactor({balance: 1000400})).to.equal(500);
      expect(orderSystem.getBalanceFactor({balance: 1000001})).to.equal(500);
    });
  });

  describe('Boundaries', function () {
    it('should return 6 if balance is exactly -100', function () {
      expect(orderSystem.getBalanceFactor({balance: -100})).to.equal(6);
    });

    it('should return 500 if balance is exactly 1000000000', function () {
      expect(orderSystem.getBalanceFactor({balance: 1000000000})).to.equal(500);
    });

    it('should return 6 if balance is exactly 0', function () {
      expect(orderSystem.getBalanceFactor({balance: 0})).to.equal(6);
    });

    it('should return 30 if balance is exactly 1000', function () {
      expect(orderSystem.getBalanceFactor({balance: 1000})).to.equal(30);
    });

    it('should return 70 if balance is exactly 50000', function () {
      expect(orderSystem.getBalanceFactor({balance: 50000})).to.equal(70);
    });

    it('should return 200 if balance is exactly 100000', function () {
      expect(orderSystem.getBalanceFactor({balance: 100000})).to.equal(200);
    });

    it('should return 200 if balance is exactly 1000000', function () {
      expect(orderSystem.getBalanceFactor({balance: 1000000})).to.equal(200);
    });

    it('should return undefined if no balance is given', function () {
      expect(orderSystem.getBalanceFactor()).to.equal(undefined);
    });
  });
});

describe('AccountStatus', function () {
  describe('decision table suite', function () {

    it('should return invalid when age factor is -1, and balance factor is positive', function () {
      var account = { age: -1, balance: 10 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
    });

    it('should return poor when age factor is 1, and balance factor is positive', function () {
      var account = { age: 1, balance: 10 };
      expect(orderSystem.AccountStatus(account)).to.equal('poor');
    });

    it('should return poor when age factor is 5, and balance factor is between 6 and 70', function () {
      var account = { age: 1, balance: 9999 };
      expect(orderSystem.AccountStatus(account)).to.equal('poor');
    });

    it('should return fair when age factor is 5, and balance factor is 200 or 500', function () {
      var account = { age: 1, balance: 100000 };
      expect(orderSystem.AccountStatus(account)).to.equal('fair');
    });

    it('should return poor when age factor is 10, and balance factor is between 6 and 70', function () {
      var account = { age: 4, balance: 10000 };
      expect(orderSystem.AccountStatus(account)).to.equal('poor');
    });

    it('should return fair when age factor is 10, and balance factor is 200', function () {
      var account = { age: 4, balance: 100001 };
      expect(orderSystem.AccountStatus(account)).to.equal('fair');
    });

    it('should return good when age factor is 10, and balance factor is 500', function () {
      var account = { age: 4, balance: 1000001 };
      expect(orderSystem.AccountStatus(account)).to.equal('good');
    });

    it('should return poor when age factor is 20, and balance factor is between 6 and 30', function () {
      var account = { age: 6, balance: 1 };
      expect(orderSystem.AccountStatus(account)).to.equal('poor');
    });

    it('should return fair when age factor is 20, and balance factor is 70', function () {
      var account = { age: 6, balance: 50000 };
      expect(orderSystem.AccountStatus(account)).to.equal('fair');
    });

    it('should return good when age factor is 20, and balance factor is between 200 and foo', function () {
      var account = { age: 6, balance: 1000001 };
      expect(orderSystem.AccountStatus(account)).to.equal('good');
    });

    it('should return poor when age factor is 50, and balance factor is 6', function() {
      var account = { age: 100, balance: 0 };
      expect(orderSystem.AccountStatus(account)).to.equal('poor');
    });

    it('should return fair when age factor is 50, and balance factor is 16 to 30', function() {
      var account = { age: 100, balance: 1000 };
      expect(orderSystem.AccountStatus(account)).to.equal('fair');
    });

    it('should return good when age factor is 50, and balance factor is 70  to 200', function() {
      var account = { age: 100, balance: 100001 };
      expect(orderSystem.AccountStatus(account)).to.equal('good');
    });

    it('should return very good when age factor is 50, and balance factor is 500', function() {
      var account = { age: 100, balance: 1000001 };
      expect(orderSystem.AccountStatus(account)).to.equal('very good');
    });

    it('should return invalid if age factor is negative, and balance factor is not', function() {
      var account = { age: -1, balance: 1000001 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
      var account = { age: -1, balance: 100 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
      var account = { age: -1, balance: 500 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
    });

    it('should return invalid if balance factor is negative, and age factor is not', function() {
      var account = { age: 1, balance: -150 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
      var account = { age: 5, balance: -150 };
      expect(orderSystem.AccountStatus(account)).to.equal('invalid');
    });
  });
});

describe('creditStatus', function () {

  describe('decision table suite', function () {
    it('should return bad in strict mode, with credit score less than 750', function () {
      var client = {credit: 749};
      expect(orderSystem.creditStatus(client, 'strict')).to.equal('bad');
    });

    it('should return bad in default mode, with credit score less than 700', function () {
      var client = {credit: 699};
      expect(orderSystem.creditStatus(client, 'default')).to.equal('bad');
    });

    it('should return good in strict mode, with credit score more than 750', function () {
      var client = {credit: 751};
      expect(orderSystem.creditStatus(client, 'strict')).to.equal('good');
    });

    it('should return good in strict mode, with credit score of 750', function () {
      var client = {credit: 750};
      expect(orderSystem.creditStatus(client, 'strict')).to.equal('good');
    });

    it('should return good in default mode, with credit score more than 700', function () {
      var client = {credit: 701};
      expect(orderSystem.creditStatus(client, 'default')).to.equal('good');
    });

    it('should return good in default mode, with credit score of 700', function () {
      var client = {credit: 700};
      expect(orderSystem.creditStatus(client, 'default')).to.equal('good');
    });
  });

  describe('Boundaries', function () {
    it('should return invalid if credit is outside the boundaries', function() {
      var client = {credit: -1};
      expect(orderSystem.creditStatus(client, 'strict')).to.equal('invalid');
    });
    it('should return invalid with missing or incorrect mode', function() {
      var client = {credit: 750};
      expect(orderSystem.creditStatus(client, 'BOB BARKER')).to.equal('invalid');
      expect(orderSystem.creditStatus(client)).to.equal('invalid');
    });
  });
});

describe('productStatus', function () {

  var store;
  beforeEach(function () {
    store = [
      { name: 'lemmons', q: 7 },
      { name: 'plumses', q: 1 },
      { name: 'Ryan Holmes', q: 1 }
    ];
  });

  it('should return soldout for items not in the store, regardless of storeThreshold', function () {
    var product = 'does not exist';
    var storeThreshold = 1;
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    var storeThreshold = 0;
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    var storeThreshold = -1;
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    var storeThreshold = 100;
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
  });

  it('should return limited for items in the array, but less than the threshhold', function () {
    expect(orderSystem.productStatus('lemmons', store, 10)).to.equal('limited');
    expect(orderSystem.productStatus('plumses', store, 2)).to.equal('limited');
  });

  it('should return available for items in the store greater than the thrshold', function () {
    expect(orderSystem.productStatus('lemmons', store, 6)).to.equal('available');
    expect(orderSystem.productStatus('plumses', store, 0)).to.equal('available');
  });

  it('should return available for items in the store equal to the threshold', function () {
    expect(orderSystem.productStatus('lemmons', store, 7)).to.equal('available');
    expect(orderSystem.productStatus('Ryan Holmes', store, 1)).to.equal('available');
  });
});

describe('orderHandling', function () {
  var store;
  beforeEach(function () {
    store = [
      { name: 'lemmons', q: 7 },
      { name: 'plumses', q: 1 },
      { name: 'Ryan Holmes', q: 1 }
    ];
  });

  it('should return accepted if account status is very good', function () {
    var product = "";
    var storeThreshold = 0;
    var client = { age: 100, balance: 1000001, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('very good');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('accepted');
  });

  it('should return accepted if account status and creditStatus are good', function () {
    var product = "";
    var storeThreshold = 0;
    var client = { age: 100, balance: 100000, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('good');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('accepted');
  });

  it('should return accepted if account status is poor, but creditStatus is good, product status available', function () {
    var product = "lemmons";
    var storeThreshold = 1;
    var client = { age: 2, balance: 10, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('poor');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('available');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('accepted');
  });

  it('should return accepted if account status is fair, but creditStatus is good, product status available', function () {
    var product = "lemmons";
    var storeThreshold = 1;
    var client = { age: 10, balance: 10, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('available');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('accepted');
  });

  it('should return pending if account status is fair, but creditStatus is good, product status limited', function () {
    var product = "lemmons";
    var storeThreshold = 8;
    var client = { age: 10, balance: 10, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('limited');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('pending');
  });

  it('should return pending if account status is fair, but creditStatus is good, product status sold-out', function () {
    var product = "numpy";
    var storeThreshold = 8;
    var client = { age: 10, balance: 10, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('pending');
  });

  it('should return pending if account status is poor, but creditStatus is good, product status limited', function () {
    var product = "lemmons";
    var storeThreshold = 9;
    var client = { age: 2, balance: 10, client: 749};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('poor');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('limited');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('pending');
  });

  it('should return underReview if account status is good, but creditStatus is bad', function () {
    var product = "lemmons";
    var storeThreshold = 9;
    var client = { age: 100, balance: 1000000, credit: 20};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('good');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('bad');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('underReview');
  });

  it('should return underReview if account status is fair, but creditStatus is bad, productStatus is available', function () {
    var product = "lemmons";
    var storeThreshold = 3;
    var client = { age: 100, balance: 1000, credit: 20};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('bad');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('available');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('underReview');
  });

  it('should return rejected if account status is fair, but creditStatus is bad, productStatus limted', function () {
    var product = "lemmons";
    var storeThreshold = 9;
    var client = { age: 100, balance: 1000, credit: 20};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('bad');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('limited');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('rejected');
  });

  it('should return rejected if account status is fair, but creditStatus is bad, productStatus sold-out', function () {
    var product = "DRUMBS";
    var storeThreshold = 9;
    var client = { age: 100, balance: 1000, credit: 20};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('fair');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('bad');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('rejected');
  });

  it('should return rejected if account status is poor, but creditStatus is good, productStatus sold-out', function () {
    var product = "DRUMBS";
    var storeThreshold = 9;
    var client = { age: 2, balance: 1000, credit: 750 };
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('poor');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('good');
    expect(orderSystem.productStatus(product, store, storeThreshold)).to.equal('soldout');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('rejected');
  });

  it('should return rejected if account status is poor, but creditStatus is bad', function () {
    var product = "DRUMBS";
    var storeThreshold = 9;
    var client = { age: 2, balance: 1000, credit: 700};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('poor');
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('bad');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('rejected');
  });

  it('should return invalid if accountStatus is invalid', function() {
    var product = "DRUMBS";
    var storeThreshold = 9;
    var client = { age: -10000, balance: 1000, credit: 700};
    var creditCheckMode = 'strict';
    expect(orderSystem.AccountStatus(client)).to.equal('invalid');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('invalid');
  });

  it('should return invalid if creditStatus is invalid', function() {
    var product = "DRUMBS";
    var storeThreshold = 9;
    var client = { age: -10000, balance: 1000, credit: 1000000};
    var creditCheckMode = 'strict';
    expect(orderSystem.creditStatus(client, creditCheckMode)).to.equal('invalid');
    expect(orderSystem.orderHandling(client, product, store, storeThreshold, creditCheckMode)).to.equal('invalid');
  });
});
