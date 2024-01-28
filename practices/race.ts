import { PromiseX } from '../promisex'

let p1 = new PromiseX((resolve) => {
  setTimeout(() => {
    resolve('p1')
  }, 1000)
})

let p2 = new PromiseX((resolve) => {
  setTimeout(() => {
    resolve('p2')
  }, 900)
})

PromiseX.race([p1, p2]).then((v) => {
  console.log(v)
})
