module.exports = function(image) {
  var equations_buf = Buffer.alloc(image.data.length);
  var hitmap = {};
  
  for(var y = 0; y < image.height; y++) {
    for(var x = 0; x < image.width; x++) {
      var idx = (image.width * y) + x;
      
      if(image.data[idx] >= image.threshold) {
        //console.log('pixel', idx, x, y)
        
        for(var radians = 0; radians <= Math.PI; radians += 0.05) {
          var a = Math.tan(radians);
          var count = 0;
          var ranges = [];
          var lastX, lastY;
          
          if(hitmap[a] && hitmap[a][y]) continue;
          
          for(var evalX = 0; evalX < image.width; evalX++) {
            var evalY = Math.floor(a * evalX) + y;
            if(evalX == lastX && evalY == lastY) continue;
            if(evalY < 0 || evalY >= image.height) continue;
            
            var idx = (image.width * evalY) + evalX;
            
            if(image.data[idx] >= image.threshold) {
              count++;
              
              if(!ranges[ranges.length - 1] || ranges[ranges.length - 1].end == evalX - 1) {
                ranges.push({
                  start: evalX
                });
              }
              else {
                ranges[ranges.length - 1].end = evalX;
              }
            }
            
            lastX = evalX;
            lastY = evalY;
          }
          
          for(var i in ranges) {
            ranges[i].size = ranges[i].end - ranges[i].start || 0;
          }
          
          if(!hitmap[a]) hitmap[a] = {};
          if(!hitmap[a][y] || hitmap[a][y].score < count) {
            hitmap[a][y] = {
              score: count,
              ranges: ranges
            };
          }
          
          //console.log('line evaluation y = %dx + %d --> %d', a, y, count);
        }
      }
    }
  }
  
  var equations = [];
  
  for(var a in hitmap) {
    for(var b in hitmap[a]) {
      if(hitmap[a][b].ranges.length == 0) continue;
      
      var largest_range = hitmap[a][b].ranges.reduce(function(largest, range) {
        if(!largest || largest.size < range.size) return range;
        return largest;
      });
      
      equations.push({
        a: parseFloat(a),
        b: parseFloat(b),
        score: hitmap[a][b].score,
        ranges: hitmap[a][b].ranges,
        largest_range: largest_range
      });
    }
  }
  
  equations = equations.sort(function(a, b) {
    return b.largest_range.size - a.largest_range.size;
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