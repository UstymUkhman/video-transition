precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

// uniform float movementStrength;
// uniform vec2  mousePosition;
// uniform vec2  resolution;
uniform mat4  uMVMatrix;
uniform mat4  uPMatrix;
// uniform float time;

// varying vec3 vVertexPosition;
varying vec2 vTextureCoord;


void main (void) {
  vec3 vertexPosition = aVertexPosition;
  // float distanceFromMouse = distance(mousePosition, vec2(vertexPosition.x, vertexPosition.y));

  // float waveSinusoid = cos(5.0 * (distanceFromMouse - (time / 75.0)));
  // float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

  // float distortionEffect = distanceStrength * waveSinusoid * movementStrength;

  // vertexPosition.z += distortionEffect / 15.0;
  // vertexPosition.x += (distortionEffect / 15.0 * (resolution.x / resolution.y) * (mousePosition.x - vertexPosition.x));
  // vertexPosition.y += distortionEffect / 15.0 * (mousePosition.y - vertexPosition.y);

  gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
  // vVertexPosition = vertexPosition;
  vTextureCoord = aTextureCoord;
}
