const isObject = (val) => val !== null && typeof val === 'object'

const isFn = (val) => typeof val === 'function'

const isPromise = (value) => {
  if (isObject(value) || isFn(value)) {
    return isFn(value.then)
  } else {
    return false
  }
}

function PromiseX(fn) {
  let self = this
  self.state = 'pending'
  self.data = undefined
  self.reason = undefined
  self.onFulfilledQue = []
  self.onRejectedQue = []

  function resolve(data) {
    if (isPromise(data)) {
      // data instanceof PromiseX
      data.then(resolve, reject)
    } else {
      setTimeout(() => {
        self.state = 'resolved'
        self.data = data
        self.onFulfilledQue.forEach((v, i) => {
          v(self.data)
        })
      }, 0)
    }
  }

  function reject(reason) {
    setTimeout(() => {
      self.state = 'rejected'
      self.reason = reason
      self.onRejectedQue.forEach((v, i) => {
        v(self.reason)
      })
    }, 0)
  }

  try {
    fn(resolve, reject)
  } catch (reason) {
    reject(reason)
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('return value of onfulfill cannot equal to thenable'))
  }
  if (x instanceof PromiseX) {
    return x.then(resolve, reject)
  }
  if (x instanceof Object || x instanceof Function) {
    try {
      const then = x.then
      if (then instanceof Function) {
        then.call(
          x,
          function (value) {
            resolvePromise(promise, value, resolve, reject)
          },
          function (reason) {
            reject(reason)
          }
        )
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}

PromiseX.prototype.then = function (onfulfill, onreject) {
  let self = this,
    promise2 = undefined

  // 对onfulfill和onreject进行处理
  onfulfill = onfulfill instanceof Function ? onfulfill : (value) => value
  onreject = onreject instanceof Function ? onreject : (reason) => reason

  if (self.state === 'resolved') {
    promise2 = new PromiseX((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onfulfill(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      }, 0)
    })
    return promise2
  }
  if (self.state === 'rejected') {
    promise2 = new PromiseX((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onreject(self.reason)
          reject(x)
        } catch (reason) {
          reject(reason)
        }
      }, 0)
    })
    return promise2
  }
  if (self.state === 'pending') {
    promise2 = new PromiseX((resolve, reject) => {
      self.onFulfilledQue.push(function (data) {
        setTimeout(() => {
          try {
            let x = onfulfill(data)
            resolvePromise(promise2, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        }, 0)
      })

      self.onRejectedQue.push(function (data) {
        setTimeout(() => {
          try {
            let x = onreject(data)
            reject(x)
          } catch (reason) {
            reject(reason)
          }
        }, 0)
      })
    })
    return promise2
  }
}

PromiseX.prototype.catch = function (fn) {
  console.log('in catch')
  return this.then(null, fn)
}

PromiseX.prototype.finally = function (fn) {
  return this.then(
    () => {
      return PromiseX.resolve(fn()).then((n) => data)
    },
    () => {
      return PromiseX.resolve(fn()).then((n) => {
        throw new Error(n)
      })
    }
  )
}

PromiseX.resolve = function (value) {
  return new PromiseX(function (resolve) {
    resolve(value)
  })
}

PromiseX.reject = function (reason) {
  return new PromiseX(function (_, reject) {
    reject(reason)
  })
}

PromiseX.all = function (promises) {
  const ary = []
  let count = 0

  function processData(key, value, resolve) {
    count++
    ary[key] = value
    // 如果 promise 中是异步 `resolve` 的话
    // 使用 `promises.length === ary.length` 判断会有问题
    if (count === promises.length) {
      resolve(ary)
    }
  }

  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      if (isPromise(item)) {
        item
          .then((res) => {
            processData(index, res, resolve)
          })
          .catch((err) => {
            reject('reject promise' + index + err)
          })
      } else {
        processData(index, item, resolve)
      }
    })
  })
}

PromiseX.race = function (promises) {
  let execute = []
  return new PromiseX((resolve, reject) => {
    if (!(promises instanceof Array)) {
      return reject(new Error('parameter must be a Function Type'))
    }
    promises.forEach((promise) => {
      PromiseX.resolve(promise).then((value) => {
        execute.length === 0 ? resolve(value) : void 0
        execute.push(promise)
      })
    })
  })
}

module.exports = PromiseX
