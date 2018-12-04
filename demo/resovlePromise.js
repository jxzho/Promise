const PromiseA = require('../PromiseA');

let p = new PromiseA(resovle => {
  resovle(123);
});

p.then(data => {
  console.log('start：' + data);
  return new Promise(resovle => {
    resovle(data);
  });
}).then(data => {
  console.log('last：' + data);
});

console.log(Promise.all);