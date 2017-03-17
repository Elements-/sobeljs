module.exports = function(data, overlay, r, g, b) {
  for(var i = 0; i < overlay.length; i++) {
    if(overlay[i] == 0) continue;
    
    var idx = i * 4;
    
    data[idx] =     (overlay[i]     / 255) * r;
    data[idx + 1] = (overlay[i + 1] / 255) * g;
    data[idx + 2] = (overlay[i + 2] / 255) * b;
    data[idx + 3] = 255;
  }
  
  return data;
}