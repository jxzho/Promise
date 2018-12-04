let promise3 = new Promise(resolve => {
  resolve(3);
});

let promise1 = new Promise(resolve => {
  resolve(promise3);
});

let promise2 = new Promise(resolve => {
  resolve(2);
});

Promise.all([promise1, promise2])
  .then(data => {
    console.log(data);
  });