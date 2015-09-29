precision mediump float;

varying vec3 vnormal;

void main () {
  gl_FragColor = vec4(normalize(vnormal) * 0.5 + 0.5, 1);
}
