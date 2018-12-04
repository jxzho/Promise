const proposeToMissHan = (isOK) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      isOK ? resolve('ok') : reject('no');
    }, 50);
  })
    .then(data => console.log(data))
    .catch(data => console.log(data));
};

proposeToMissHan(false);