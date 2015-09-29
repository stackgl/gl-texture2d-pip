precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform sampler2D t_position;
uniform sampler2D t_normal;
uniform sampler2D t_albedo;
uniform float time;
uniform vec3 eye;

varying vec2 vuv;

#pragma glslify: fog = require('glsl-fog')

float getOutline(sampler2D t_normal, vec2 vuv, float off) {
  vec3 nab = texture2D(t_normal, vuv - off * vec2(1, 0)).rgb * 2.0 - 1.0;
  vec3 nca = texture2D(t_normal, vuv + off * vec2(1, 0)).rgb * 2.0 - 1.0;
  vec3 nba = texture2D(t_normal, vuv - off * vec2(0, 1)).rgb * 2.0 - 1.0;
  vec3 nac = texture2D(t_normal, vuv + off * vec2(0, 1)).rgb * 2.0 - 1.0;

  return length(nab - nca) + length(nba - nac);
}

void main () {
  vec3 position = texture2D(t_position, vuv).rgb;
  vec3 normal = normalize(texture2D(t_normal, vuv).rgb * 2.0 - 1.0);
  vec4 albedo = texture2D(t_albedo, vuv);
  float depth = mix(1000000.0, length(eye - position), albedo.a);

  vec3 dir = normalize(vec3(sin(time), 1, cos(time)));
  float amb = 0.1;
  float dif = max(0.0, dot(normal, dir));

  vec3 color;
  float amp = smoothstep(0.5, 0.505, dif + amb) * 0.9 + 0.1;
  color = amp * albedo.rgb;
  color = getOutline(t_normal, vuv, 0.005) > 0.75 ? vec3(0.0) : color;
  color = mix(color, vec3(0.25, 0.45, 0.75), fog(depth, 0.03125));

  gl_FragColor = vec4(color, 1.0);
}
