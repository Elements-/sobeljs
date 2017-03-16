exports.fromRGBA = function(data) {
  var buf = Buffer.alloc(data.length / 4);
  
  for(var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    buf[i / 4] = (r + g + b) / 3;
  }
  
  return buf;
}

exports.toRGBA = function(data) {
  var buf = Buffer.alloc(data.length * 4, 255);
  
  for(var i = 0; i < buf.length; i += 4) {
    var intensity = data[i / 4];
    buf[i] = intensity;
    buf[i + 1] = intensity;
    buf[i + 2] = intensity;
  }
  
  return buf;
}