precision highp float;

#define PI 3.141592653589793

uniform sampler2D first;
uniform sampler2D second;
uniform sampler2D displacement;

uniform float transitionTimer;
uniform vec2  mousePosition;
uniform vec2  resolution;

uniform float maxRadius;
uniform float minRadius;

varying vec2 vTextureCoord;

void main (void) {
  vec4 displacementTexture = texture2D(displacement, vTextureCoord);
  float displacementFactor = (cos(transitionTimer / (90.0 / PI)) + 1.0) / 2.0;

  vec2 secondDisplacementCoords = vec2(vTextureCoord.x - (1.0 - displacementFactor) * (displacementTexture.r * 1.0), vTextureCoord.y);
  vec2 firstDisplacementCoords = vec2(vTextureCoord.x + displacementFactor * (displacementTexture.r * 1.0), vTextureCoord.y);
  vec2 displacementCoords = (mousePosition.x < resolution.x / 2.0) ? firstDisplacementCoords : secondDisplacementCoords;

  vec4 displacementColor = texture2D(displacement, displacementCoords);
  vec4 secondColor = texture2D(second, vTextureCoord);
  vec4 firstColor = texture2D(first, vTextureCoord);

  firstColor = mix(firstColor, displacementColor, displacementFactor);
  firstColor = mix(firstColor, secondColor, displacementFactor);

  float mouseDistance = distance(mousePosition, gl_FragCoord.xy) - minRadius;
  float amount = clamp(mouseDistance / (maxRadius - minRadius), 0.0, 1.0);

  gl_FragColor = mix(firstColor, secondColor, amount);
}
