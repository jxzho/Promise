function go(color) {
  function red() {
    console.log('red');
    setTimeout(green, 1000);
  }
  function green() {
    console.log("green");
    setTimeout(yellow, 2000);
  }
  function yellow() {
    console.log("yellow");
    setTimeout(red, 3000);
  }
  switch (color) {
    case "red":
      red();
      break;
    case "green":
      green();
      break;
    case "yellow":
      yellow();
      break;
  }
}

function start() {
  go('red'); // 红灯先亮
}
start();
