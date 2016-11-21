var table = "";
[-1, 1, 5, 10, 20, 50].forEach((ageFactor) => {

  [-1, 6, 16, 30, 70, 200, 500].forEach((balanceFactor) => {
    var accountFactor = balanceFactor * ageFactor;
    if(accountFactor < 0) {
      table += `
        [${ageFactor} | ${balanceFactor} | invalid]
      `
    } else if (accountFactor >=0 && accountFactor <= 700) {
      table += `
        [${ageFactor} | ${balanceFactor} | poor]
      `
    } else if (accountFactor > 700 && accountFactor <= 3000) {
      table += `
        [${ageFactor} | ${balanceFactor} | fair]
      `
    } else if (accountFactor > 3000 && accountFactor <= 10000) {
      table += `
        [${ageFactor} | ${balanceFactor} | good]
      `
    } else if (accountFactor > 10000) {
      table += `
        [${ageFactor} | ${balanceFactor} | very good]
      `
    } else {
      console.log('NO MATCHS', ageFactor, balanceFactor);
    }
  });

});


console.log(table);
