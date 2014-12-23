var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var canvas;
var context;

var starField;

function main() {
  canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);

  init();

  var lastTime = Date.now();
  var delta;

  var loop = function() {
    var now = Date.now();
    delta = (now - lastTime) / 1000;
    lastTime = now;

    update(delta);
    render();

    window.requestAnimationFrame(loop, canvas);
  }

  window.requestAnimationFrame(loop, canvas);
}

function init() {
  starField = new StarField((2 << 9), 64, 10, 70);
}

function update(delta) {
  starField.update(delta);
}

function render() {
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.save();
  context.fillStyle = "#FFF";

  starField.render();

  context.restore();
}

main();