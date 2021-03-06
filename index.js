var fs = require('fs');
var pngjs = require('pngjs');
var glur = require('glur');
var filters = require('./lib');
var kernels = require('./kernels');

console.time('read');
var png_raw = fs.readFileSync(process.argv[2]);
console.timeEnd('read');


console.time('decode');
var png = pngjs.PNG.sync.read(png_raw);
console.timeEnd('decode');


console.time('blur');
glur(png.data, png.width, png.height, 1);
console.timeEnd('blur');


console.time('rgba to greyscale');
var greyscale_data = filters.greyscale.fromRGBA(png.data);
console.timeEnd('rgba to greyscale');


console.time('sobel');
var sobel_data = filters.sobel(
  {
    width: png.width,
    height: png.height,
    data: greyscale_data,
    threshold: 10
  },
  [
    kernels.X,
    kernels.Y
  ]
);
console.timeEnd('sobel');

console.time('lines');
var lines_data = filters.lines(
  {
    width: png.width,
    height: png.height,
    data: sobel_data,
    threshold: 1
  }
);
console.timeEnd('lines');


console.time('greyscale to rgba');
png.data = filters.greyscale.toRGBA(sobel_data);
console.timeEnd('greyscale to rgba');


console.time('overlay');
png.data = filters.overlay(png.data, lines_data, 255, 0, 0);
console.timeEnd('overlay');


console.time('encode');
var out_png = pngjs.PNG.sync.write(png);
console.time('encode');


console.time('write');
fs.writeFileSync(process.argv[3], out_png);
console.timeEnd('write');