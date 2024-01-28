import { PromiseX } from '../promisex'

let promise3 = new PromiseX((resolve) => {
  resolve(3)
})

let promise1 = new PromiseX((resolve) => {
  resolve(promise3)
})

let promise2 = new PromiseX((resolve) => {
  resolve(2)
})

PromiseX.all([promise1, promise2]).then((data) => {
  console.log(data)
})
