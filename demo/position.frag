precision mediump float;

varying vec3 vposition;

void main () {
  gl_FragColor = vec4(vposition, 1);
}
