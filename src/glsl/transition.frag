precision highp float;

uniform sampler2D firstTexture;
uniform sampler2D secondTexture;
uniform sampler2D displacement;

uniform vec2  mousePosition;
uniform float maxRadius;
uniform float minRadius;

varying vec2 vTextureCoord;


void main (void) {
  vec4 color0 = texture2D(firstTexture, vTextureCoord);
  vec4 color1 = texture2D(secondTexture, vTextureCoord);
  
  float dist = distance(mousePosition, gl_FragCoord.xy);
  float mixAmount = clamp((dist - minRadius) / (maxRadius - minRadius), 0.0, 1.0);
  
  gl_FragColor = mix(color0, color1, mixAmount);
}
