var fs = require('fs');
var pngjs = require('pngjs');
var glur = require('glur');
var sobel = require('./lib/sobel');

var default_kernels = [
  [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ],
  [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1]
  ]
];

console.log('Reading image');
var png = pngjs.PNG.sync.read(
  fs.readFileSync(process.argv[2])
);

console.log('Blurring image');
glur(png.data, png.width, png.height, 1);

console.log('Processing image');
png = sobel(
  png,
  default_kernels
);

console.log('Writing image');
fs.writeFileSync(
  process.argv[3],
  pngjs.PNG.sync.write(png)
);