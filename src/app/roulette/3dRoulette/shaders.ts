export const vertexShader = `
   varying vec3 vLocalPosition;
     void main() {
         vLocalPosition = position;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

export const fragmentShader = `
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