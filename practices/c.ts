import { PromiseX } from '../promisex'

let p = new PromiseX((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('test error'))
  }, 1000)
})

p.then(
  (value) => {
    console.log(value)
  },
  (reason) => {
    console.log(reason)
    return reason
  }
)
  .then(
    (value) => {
      console.log(value)
    },
    (reason) => {
      console.log(reason)
      return reason
    }
  )
  .catch((reason) => {
    console.log(reason)
  })
