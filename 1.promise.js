let Promise = require("./Promise");

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("i am data");
  }, 0);
});

p.then(data => {
  console.log(data);
  return new Promise((resolve, reject) => {
    resolve('i am super data');
  });
}).then(data => {
  console.log(data);
});
