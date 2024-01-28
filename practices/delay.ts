import { PromiseX } from '../promisex'

/*
 * 利用 Promise.race 原理实现超时报错机制
 * PromiseDelay
 */
function PromiseDelay (promise, delay) {
  let timeoutPromise = new PromiseX((resolve) => {
    setTimeout(resolve, delay)
  }).then(() => {
    throw new Error('time out :' + delay)
  })
  return PromiseX.race([promise, timeoutPromise])
}

let promise = new PromiseX((resolve) => {
  setTimeout(() => {
    resolve('success')
  }, 1001)
})

PromiseDelay(promise, 1000)
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
