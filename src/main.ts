import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as SHADERS from './shaders';
import { OBJLoader } from 'three/examples/jsm/Addons.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2, 2, 2);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x282c34);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 10;
controls.minDistance = 2;

// Add lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1.5, 1.25);
scene.add(light);

const hemiLight = new THREE.HemisphereLight(0x8d7c7c, 0x494966, 3);
scene.add(hemiLight);

const loader = new OBJLoader();
loader.load('./bunny.obj', function (model) {
  model.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    }
  });
  model.scale.set(10, 10, 10);
  model.position.set(0.25, -0.85, 0);
  scene.add(model);

  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }

}, (event) => {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.innerText = `LOADING... ${Math.round((event.loaded / event.total) * 100)}%`;
  }
}, function (error) {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.innerText = `An error occurred: ${error}`;
  }
});

// Add sphere on equidistant points around the model
const radius = 2; // radius of the sphere
const numPoints = 100; // number of points

for (let i = 0; i < numPoints; i++) {
  const newMat = new THREE.ShaderMaterial({
    vertexShader: SHADERS.vertCode,
    fragmentShader: SHADERS.fragCode,
    transparent: true,
  });
  newMat.uniforms = {
    lightPos: { value: light.position },
    diffIntensity: { value: 0.6 },
    ambientIntensity: { value: 0.4 },
    color: { value: new THREE.Vector3(Math.random(), Math.random(), Math.random()) },
    cameraPos: { value: camera.position },
    width: { value: window.innerWidth },
    height: { value: window.innerHeight },
  };

  const newSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), newMat);

  const phi = Math.acos(1 - (2 * i) / numPoints);
  const theta = Math.sqrt(numPoints * Math.PI) * phi;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  newSphere.position.set(x, y, z);

  scene.add(newSphere);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Render the scene with the camera
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
