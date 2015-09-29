precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vposition;
varying vec3 vnormal;

uniform mat4 proj;
uniform mat4 view;

void main () {
  vposition = position;
  vnormal = normal;

  gl_Position = proj * view * vec4(position, 1);
}
