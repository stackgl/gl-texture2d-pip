precision mediump float;

attribute vec2 position;
uniform vec2 res;
varying vec2 vuv;
varying vec2 vpx;

void main () {
  vuv = position * 0.5 + 0.5;
  vpx = vuv * res;

  gl_Position = vec4(position, 1, 1);
}
