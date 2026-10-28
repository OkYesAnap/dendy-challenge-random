export const vertexShader = `
   varying vec3 vLocalPosition;
     void main() {
         vLocalPosition = position;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

export const blackWhiteShader = `
    uniform vec3 uWhite;
    uniform vec3 uBlack;
    uniform float uSegments;
    varying vec3 vLocalPosition;
    const float PI = 3.1415926535897932384626433832795;
    void main() {
      float angle = atan(vLocalPosition.x, vLocalPosition.z);
      if (angle < 0.0) angle += 2.0 * PI;

      float segAngle = 2.0 * PI / uSegments;
      float segIndex = floor(angle / segAngle);

      float parity = mod(segIndex, 2.0);

      vec3 color = mix(uWhite, uBlack, parity);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

export const randomColorShader = `
    uniform float uSegments;
    varying vec3 vLocalPosition;
    const float PI = 3.1415926535897932384626433832795;

    float hash(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    void main() {
      float angle = atan(vLocalPosition.x, vLocalPosition.z);
      if (angle < 0.0) angle += 2.0 * PI;

      float segAngle = 2.0 * PI / uSegments;
      float segIndex = floor(angle / segAngle);

      vec3 color;
      color.r = hash(segIndex + 1.0);
      color.g = hash(segIndex + 2.0);
      color.b = hash(segIndex + 3.0);

      gl_FragColor = vec4(color, 1.0);
    }
  `;