module.exports = function(image) {
  var equations_buf = Buffer.alloc(image.data.length);
  var hitmap = {};
  
  for(var y = 0; y < image.height; y++) {
    for(var x = 0; x < image.width; x++) {
      var idx = (image.width * y) + x;
      
      if(image.data[idx] /*>= image.threshold*/ == 255) {
        //console.log('pixel', idx, x, y)
        
        for(var radians = 0; radians <= Math.PI; radians += 0.1) {
          var a = Math.tan(radians);
          var count = 0;
          var lastX, lastY;
          
          //if(hitmap[a] && hitmap[a][y]) continue;
          
          for(var evalX = 0; evalX < image.width; evalX++) {
            var evalY = Math.floor(a * evalX) + y;
            if(evalX == lastX && evalY == lastY) continue;
            if(evalY < 0 || evalY >= image.height) continue;
            
            var idx = (image.width * evalY) + evalX;
            if(image.data[idx] >= image.threshold) {
              count++;
            }
            
            lastX = evalX;
            lastY = evalY;
          }
          
          if(!hitmap[a]) hitmap[a] = {};
          if(!hitmap[a][y] || hitmap[a][y] < count) hitmap[a][y] = count;
          
          //console.log('line evaluation y = %dx + %d --> %d', a, y, count);
        }
      }
    }
  }
  
  var equations = [];
  
  for(var a in hitmap) {
    for(var b in hitmap[a]) {
      equations.push({
        a: parseFloat(a),
        b: parseFloat(b),
        score: hitmap[a][b]
      });
    }
  }
  
  equations = equations.sort(function(a, b) {
    return b.score - a.score;
  });
  
  equations = equations.slice(0, 10);
  
  for(var equation of equations) {
    for(var x = 0; x < image.width; x++) {
      var y = Math.floor(equation.a * x) + equation.b;
      if(y < 0 || y >= image.height) continue;
      var idx = (y * image.width) + x;
      equations_buf[idx] = Math.floor((equation.score / equations[0].score) * 255);
    }
  }
  
  return equations_buf;
}