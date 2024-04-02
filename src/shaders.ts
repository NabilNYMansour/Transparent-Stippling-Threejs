// Shaders
export const vertCode = `
varying vec3 FragPos;  
varying vec3 Normal;
varying vec2 vUv;

void main() {
    // Compute view direction in world space
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(-worldPos.xyz);

    Normal = normalize(normal);
    FragPos = vec3(modelMatrix * vec4(position, 1.0));
    
    // Output vertex position
    gl_Position = projectionMatrix * worldPos;

    vUv = uv;
}
`;


export const fragCode = `
precision mediump float;

varying vec3 FragPos;
varying vec3 Normal;
varying vec2 vUv;

uniform vec3 color;
uniform vec3 lightPos;
uniform vec3 cameraPos;


uniform float diffIntensity;
uniform float ambientIntensity;

const mat4 thresholdMatrix = mat4(
    1.0,  9.0,  3.0, 11.0,
    13.0,  5.0, 15.0,  7.0,
    4.0, 12.0,  2.0, 10.0,
    16.0,  8.0, 14.0,  6.0
);

void main() {
    vec3 lightDir = normalize(lightPos - FragPos); 

    vec3 D = color * max(dot(lightPos, Normal),0.)*diffIntensity;
    vec3 A = color * ambientIntensity;
    
    vec3 finalColor = A + D;

    float alpha = length(cameraPos-FragPos);
    alpha -= thresholdMatrix[int(mod(gl_FragCoord.x,4.))][int(mod(gl_FragCoord.y,4.))]/5.;

    gl_FragColor = vec4(finalColor, alpha);
}
`;
