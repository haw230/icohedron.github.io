function StarField(numStars, spread, speed, fov) {

  this.numStars = numStars;
  this.spread = spread;
  this.speed = speed;
  this.fov = fov;

  this.starX = new Array();
  this.starY = new Array();
  this.starZ = new Array();

  this.initStar = function(index) {
    this.starX[index] = 2 * (Math.random() - 0.5) * this.spread;
    this.starY[index] = 2 * (Math.random() - 0.5) * this.spread;
    this.starZ[index] = (Math.random() + 0.00001) * this.spread;
  }

  for (var i = 0; i < this.numStars; i++) {
    this.initStar(i);
  }

  this.update = function(delta) {
    for (var i = 0; i < this.numStars; i++) {
      this.starZ[i] -= delta * this.speed;

      if (this.starZ[i] <= 0) {
        this.initStar(i);
      }
    }
  }

  this.render = function() {
    var halfWidth = WIDTH / 2;
    var halfHeight = HEIGHT / 2;

    for (var i = 0; i < numStars; i++) {
      var x = Math.round((this.starX[i] / (Math.tan(fov / 2) * this.starZ[i])) * halfWidth + halfWidth);
      var y = Math.round((this.starY[i] / (Math.tan(fov / 2) * this.starZ[i])) * halfHeight + halfHeight);

      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        this.initStar(i);
      } else {
        context.fillRect(x, y, 2, 2);
      }
    }
  }
}