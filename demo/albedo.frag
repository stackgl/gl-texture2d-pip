precision mediump float;

uniform vec2 res;

void main () {
  gl_FragColor.rgb = mix(
    vec3(0, 0.5, 0.9),
    vec3(0.4, 0.8, 0.4),
    sin(gl_FragCoord.x * 2.) * 0.5 + 0.5
  );

  gl_FragColor.a = 1.0;
}
