function PromiseX(fn) {
  let self = this;
  self.state = "pending";
  self.data = undefined;
  self.reason = undefined;
  self.onFulfilledQue = [];
  self.onRejectedQue = [];

  function resolve(data) {
    if (data instanceof PromiseX) {
      data.then(resolve, reject);
    } else {
      setTimeout(() => {
        self.state = "resolved";
        self.data = data;
        self.onFulfilledQue.forEach((v, i) => {
          v(self.data);
        });
      }, 0);
    }
  }

  function reject(reason) {
    if (reason instanceof PromiseX) {
      reason.then(resolve, reject);
    } else {
      setTimeout(() => {
        self.state = "rejected";
        self.reason = reason;
        self.onRejectedQue.forEach((v, i) => {
          v(self.reason);
        });
      }, 0);
    }
  }

  try {
    fn(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

function resolvePromise() {
  
}

PromiseX.prototype.then = function(onfulfill, onreject) {
  let self = this;
  if (self.state === "resolved") {
    return new PromiseX((resolve, reject) => {
      setTimeout(() => {
        try {
          let rt = onfulfill(self.data);
          if (rt instanceof PromiseX) {
            rt.then(resolve);
          } else {
            resolve(rt);
          }
        } catch (reason) {
          reject(reason);
        }
      }, 0);
    });
  }
  if (self.state === "rejected") {
    return new PromiseX((resolve, reject) => {
      setTimeout(() => {
        try {
          let rt = onreject(self.data);
          if (rt instanceof PromiseX) {
            rt.then(resolve);
          } else {
            resolve(rt);
          }
        } catch (reason) {
          reject(reason);
        }
      }, 0);
    });
  }
  if (self.state === "pending") {
    return new PromiseX((resolve, reject) => {
      self.onFulfilledQue.push(function(data) {
        setTimeout(() => {
          try {
            let rt = onfulfill(data);
            if (rt instanceof PromiseX) {
              rt.then(resolve);
            } else {
              resolve(rt);
            }
          } catch (reason) {
            reject(reason);
          }
        }, 0);
      });

      self.onRejectedQue.push(function(data) {
        setTimeout(() => {
          try {
            let rt = onreject(data);
            if (rt instanceof PromiseX) {
              rt.then(resolve);
            } else {
              resolve(rt);
            }
          } catch (reason) {
            reject(reason);
          }
        }, 0);
      });
    });
  }
};

PromiseX.prototype.catch = function(fn) {
  return this.then(null, fn);
};

PromiseX.resolve = function (value) {
  return new PromiseX(function (resolve, reject) {
    resolve(value);
  });
};

PromiseX.reject = function(reason) {
  return new PromiseX(function(resolve, reject) {
    reject(reason);
  });
};

PromiseX.race = function(promises) {
  let execute = [];
  return new PromiseX((resolve, reject) => {
    if (!(promises instanceof Array)) {
      return reject(new Error('parameter must be a Function Type'));
    }
    promises.forEach(promise => {
      PromiseX.resolve(promise).then(value => {
        execute.length === 0 ? resolve(value) : void (0);
        execute.push(promise);
      });
    });
  });
}

module.exports = PromiseX;
