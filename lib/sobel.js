module.exports = function(image, kernels) {
  var edges_buf = Buffer.alloc(image.data.length);
  
  for(var y = 0; y < image.height; y++) {
    for(var x = 0; x < image.width; x++) {
      var intensities = [];
      
      for(var kernel of kernels) {
        var intensity = 0;
        var kCY = Math.floor(kernel.length / 2);
        var kCX = Math.floor(kernel[kCY].length / 2);
        
        if(
          x - kCX < 0 ||
          x + kCX >= image.width ||
          y - kCY < 0 ||
          y + kCY >= image.height
        ) {
          intensities.push(0);
          continue;
        }
        
        for(var kY = 0; kY < kernel.length; kY++) {
          for(var kX = 0; kX < kernel[kY].length; kX++) {
            var idx = ((y + (kY - kCY)) * image.width) + x + kX - kCX;
            intensity += image.data[idx] * kernel[kY][kX];
          }
        }
        
        intensities.push(intensity);
      }
      
      var total = 0;
      for(var val of intensities) {
        total += Math.pow(val, 2);
      }
      
      var normalized_intensity = Math.floor(Math.sqrt(total) / intensities.length) || 0;
      if(normalized_intensity > 255) {
        normalized_intensity = 255;
      }
      
      if(normalized_intensity < image.threshold) normalized_intensity = 0;
      
      var idx = (y * image.width) + x;
      edges_buf[idx] = normalized_intensity;
    }
  }
  
  return edges_buf;
}