var getAgeFactor = function(account) {
  var factor;
  var account = account || {};
  if (account.age < 0 || account.age > 100)
    factor = -1;
  else if (account.age == 0)
    factor = 1;
  else if (account.age < 2)
    factor = 5;
  else if (account.age >= 2 && account.age < 5)
    factor = 10;
  else if (account.age >= 5 && account.age < 10)
    factor = 20;
  else if (account.age >= 10 && account.age <= 100)
    factor = 50;
  return factor;
}

var getBalanceFactor = function(account) {
  var factor;
  var account = account || {};
  if (account.balance < -100 || account.balance > 1000000000)
    factor = -1;
  else if (account.balance >= -100 && account.balance <= 0)
    factor = 6;
  else if (account.balance > 0 && account.balance < 1000)
    factor = 16;
  else if (account.balance >= 1000 && account.balance < 50000)
    factor = 30;
  else if (account.balance >= 50000 && account.balance < 100000)
    factor = 70;
  else if (account.balance >= 100000 && account.balance <= 1000000)
    factor = 200;
  else if (account.balance > 1000000)
    factor = 500;

  return factor;
}

var AccountStatus = function(account) {
  var ageFactor = getAgeFactor(account);
  var balanceFactor = getBalanceFactor(account);
  var accountFactor = ageFactor * balanceFactor;

  if (accountFactor < 0) { return "invalid" }
  if (accountFactor >= 0 && accountFactor <= 700) { return "poor"; }
  if (accountFactor > 700 && accountFactor <= 3000) { return "fair"; }
  if (accountFactor > 3000 && accountFactor <=10000) { return "good" }
  return "very good";
}

var creditStatus = function(client, creditCheckMode) {
  var threshold;
  if (client.credit < 0 || client.credit > 800)
    return "invalid";

  if (creditCheckMode === "strict")
    threshold = 750;
  else if (creditCheckMode === "default")
    threshold = 700;
  else return "invalid";

  if (client.credit < threshold)
    return "bad";
  else return "good";
}

var productStatus = function(product, store, storeThreshold) {
  var quantity = 0;
  store.forEach(function (storeItem) {
    if (product === storeItem.name) {
      quantity = storeItem.q;
    }
  });

  if (quantity === 0) { return "soldout"; }
  if (quantity < storeThreshold) { return "limited"; }
  return "available";
}

var orderHandling = function(client, product, store, storeThreshold, creditCheckMode) {

  var aStautus = AccountStatus(client);
  var cStatus = creditStatus(client, creditCheckMode);
  var pStatus = productStatus(product, store, storeThreshold);

  if (aStautus === "invalid" || cStatus === "invalid")
    return "invalid";

  if ((aStautus === "very good") || (aStautus === "good" && cStatus ===
      "good") ||
    (aStautus != "good" && cStatus === "good" && pStatus === "available"))
    return "accepted";

  else if ((aStautus === "good" && cStatus === "bad") || (aStautus === "fair" &&
      cStatus === "bad" &&
      pStatus === "available"))
    return "underReview";

  else if ((aStautus === "fair" && cStatus === "good" && productStatus != "available") ||
    (aStautus === "poor" && cStatus === "good" && pStatus === "limited"))
    return "pending";

  return "rejected"
}

module.exports = {
  getAgeFactor,
  getBalanceFactor,
  AccountStatus,
  creditStatus,
  productStatus,
  orderHandling
};
