function Promise(fn) {
  let self = this;
  self.state = "pending";
  self.data = undefined;
  self.msg = undefined;
  self.onFulfilledQue = [];
  self.onRejectedQue = [];

  function resolve(data) {
    self.state = "resolved";
    self.data = data;
    self.onFulfilledQue.forEach((v, i) => {
      v(self.data);
    });
  }

  function reject(msg) {
    self.state = "rejected";
    self.msg = msg;
    self.onRejectedQue.forEach((v, i) => {
      v(self.data);
    });
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function(onfulfill, onreject) {
  let self = this;
  if (self.state === "resolved") {
    return new Promise((resolve, reject) => {
      let rt = onfulfill(self.data);
      if (rt instanceof Promise) {
        rt.then(resolve);
      } else {
        resolve(rt);
      }
    });
  }
  if (self.state === "rejected") {
  }
  if (self.state === "pending") {
    return new Promise((resolve, reject) => {
      self.onFulfilledQue.push(function() {
        let rt = onfulfill(self.data);
        if (rt instanceof Promise) {
          rt.then(resolve);
        } else {
          resolve(rt);
        }
      });

      self.onRejectedQue.push(function() {});
    });
  }
};

module.exports = Promise;
