// 利用Promise.race原理实现超时报错机制
function promiseDelay(promise, delay) {
  let timeoutPromise = new Promise(resolve => {
    setTimeout(resolve, delay);
  }).then(() => {
    throw new Error("time out :" + delay);
  });
  return Promise.race([promise, timeoutPromise]);
}

let promise = new Promise(resolve => {
  setTimeout(() => {
    resolve('success');
  }, 1001);
});

promiseDelay(promise, 1000)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });