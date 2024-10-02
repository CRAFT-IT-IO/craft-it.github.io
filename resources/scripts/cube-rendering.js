import { createPoints, updatePoints, pointCloud, initialPositions, timeOffsets } from './cube.js';

const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const material = new THREE.PointsMaterial({
  color: 0x353331, // Update to the desired color
  size: 0.5,
  transparent: false,
  map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
  alphaTest: 0.5,
  depthWrite: false,
});


// Create initial points
createPoints(scene, material);

// Variables to control mouse behavior and scroll
let mouseX = 0, mouseY = 0, isMouseInside = true, scrollActivated = false;
const initialCameraZ = 80;
let rotationSpeed = 0.001; // Rotation speed when idle
let rotating = true;
let rotationTarget = { x: 0, y: 0 }; // Target rotation to snap cube to face
let transitionProgress = 0; // Track the progress of the transition

// Reset point positions when scroll starts
let resetPointsToInitial = false;

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
  if (!scrollActivated) {
    mouseX = ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 50;
    mouseY = ((event.clientY - window.innerHeight / 2) / window.innerHeight) * -50;
    isMouseInside = true;
  }
});

document.addEventListener('mouseleave', () => {
  if (!scrollActivated) {
    isMouseInside = false;
  }
});

// Function to reset points smoothly to their initial positions
function resetPointPositions() {
  const positions = pointCloud.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];

    // Interpolate point positions back to their initial positions
    positions[i] = lerp(positions[i], initialPosition.x, 0.1);
    positions[i + 1] = lerp(positions[i + 1], initialPosition.y, 0.1);
    positions[i + 2] = lerp(positions[i + 2], initialPosition.z, 0.1);

    // Reset time offsets for smooth animation after scroll ends
    timeOffsets[i / 3] = 0;
  }

  pointCloud.geometry.attributes.position.needsUpdate = true;
}

// Function to find the closest 90-degree face
function snapToClosestFace(currentRotation) {
  const snapAngleX = Math.round(currentRotation.x / (Math.PI / 2)) * (Math.PI / 2);
  const snapAngleY = Math.round(currentRotation.y / (Math.PI / 2)) * (Math.PI / 2);
  return { x: snapAngleX, y: snapAngleY };
}

// Smooth interpolation
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Handle scrolling
window.addEventListener('scroll', () => {
  const scrollAmount = window.scrollY;

  // Stop the rotation during scroll
  rotating = false;
  scrollActivated = true;
  isMouseInside = false;
  resetPointsToInitial = true; // Activate reset behavior for points

  // Set the rotation target to snap to the closest face
  if (pointCloud) {
    rotationTarget = snapToClosestFace(pointCloud.rotation);
    transitionProgress = 0; // Reset the transition progress
  }

  // Move the camera based on scroll
  camera.position.z = initialCameraZ - scrollAmount * 0.03;

  // When scroll reaches the top, resume rotation and enable mouse effects
  if (scrollAmount === 0) {
    rotating = true;
    scrollActivated = false;
    resetPointsToInitial = false; // Disable reset behavior when scroll reaches the top
  }

});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (rotating && pointCloud) {
    // Idle rotation when not scrolling
    pointCloud.rotation.x += rotationSpeed;
    pointCloud.rotation.y += rotationSpeed;
  } else {
    // Smooth transition to snap to the closest face
    if (pointCloud) {
      const transitionSpeed = 0.02; // Speed of the transition
      transitionProgress = Math.min(transitionProgress + transitionSpeed, 1);

      pointCloud.rotation.x = lerp(pointCloud.rotation.x, rotationTarget.x, transitionProgress);
      pointCloud.rotation.y = lerp(pointCloud.rotation.y, rotationTarget.y, transitionProgress);
    }
  }

  if (!scrollActivated) {
    updatePoints(mouseX, mouseY, isMouseInside, easeInOut);
  } else if (resetPointsToInitial) {
    // Reset points to their initial positions during scroll
    resetPointPositions();
  }

  renderer.render(scene, camera);
}

animate();

// Ease function
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
