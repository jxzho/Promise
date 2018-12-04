let PromiseX = require("./PromiseX");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

new PromiseX(resolve => {
  console.log(1);
  resolve();
})
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  });

new PromiseX(resolve => {
  console.log(4);
  resolve();
})
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });

/* new Promise1(resolve => {
  console.log("promise 1");
  resolve();
})
  .then(() => {
    return console.log("A1");
  })
  .then(() => {
    return console.log("A2");
  });

new Promise1(resolve => {
  console.log("promise 2");
  resolve();
})
  .then(() => {
    return console.log("B1");
  })
  .then(() => {
    return console.log("B2");
  })
  .then(() => {
    return console.log("B3");
  }); */

console.log("end");
