precision highp float;

uniform sampler2D firstTexture;
uniform sampler2D secondTexture;
uniform sampler2D displacement;

uniform float transitionTimer;

// varying vec3 vVertexPosition;
varying vec2 vTextureCoord;


void main (void) {
  vec2 textureCoords = vec2(vTextureCoord.x, vTextureCoord.y);
  // vec4 finalColor = texture2D(firstTexture, textureCoords);

  // finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
  // finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

  vec4 displacementTexture = texture2D(displacement, textureCoords);
  float displacementFactor = (cos(transitionTimer / (90.0 / 3.141592)) + 1.0) / 2.0;

  vec2 firstDisplacementCoords = vec2(textureCoords.x + displacementFactor * (displacementTexture.r * 1.0), textureCoords.y);
  vec2 secondDisplacementCoords = vec2(textureCoords.x - (1.0 - displacementFactor) * (displacementTexture.r * 1.0), textureCoords.y);

  vec4 firstDistortedColor = texture2D(firstTexture, firstDisplacementCoords);
  vec4 secondDistortedColor = texture2D(secondTexture, secondDisplacementCoords);
  vec4 finalColor = mix(firstDistortedColor, secondDistortedColor, displacementFactor);

  finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
  gl_FragColor = finalColor;
}
