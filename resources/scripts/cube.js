export let geometry;
export let pointCloud;
export let points = [];
export let initialPositions = [];
export let timeOffsets = [];
export let gridSize = 12; // grid size in X and Y
export let spacing = 5; // Initial spacing

// Function to create points and update the point cloud (cube form)
export function createPoints(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  points.length = 0;
  initialPositions.length = 0;
  timeOffsets.length = 0;

  geometry = new THREE.BufferGeometry();

  // Create a grid of points with dynamic spacing and grid size in Z
  for (let z = 0; z < gridSizeZ; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

        points.push(posX, posY, posZ);
        initialPositions.push({ x: posX, y: posY, z: posZ });
        timeOffsets.push(0);
      }
    }
  }

  const vertices = new Float32Array(points);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  setColorsForPoints(geometry);

  if (pointCloud) {
    scene.remove(pointCloud);
  }

  material.vertexColors = true;
  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Function to set colors for points
function setColorsForPoints(geometry) {
  const colors = new Float32Array(points.length); // Same size as points
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = 1;   // Red
    colors[i + 1] = 1; // Green
    colors[i + 2] = 1; // Blue
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// Function to update points based on mouse influence (wave effect)
export function updatePoints() {
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];

    // Verify initialPosition is properly defined
    if (!initialPosition || initialPosition.x === undefined || initialPosition.y === undefined || initialPosition.z === undefined) {
      console.error('Initial position is undefined for index', i / 3);
      continue;  // Skip iteration if initialPosition is undefined
    }

    // Reset the points to their initial position with no influence
    positions[i + 2] = initialPosition.z;  // Restore initial Z position of points

    if (isNaN(positions[i + 2])) {
      console.error('NaN value detected in geometry positions at index', i);
      positions[i + 2] = initialPosition.z;  // Reset to initial Z if NaN is detected
    }
  }

  geometry.attributes.position.needsUpdate = true;  // Mark geometry as updated
}

// Function to transform points into a sphere with denser points at the poles
export function transformToSphere(scene, material) {
  points.length = 0;  // Reset points
  initialPositions.length = 0;  // Reset initial positions
  timeOffsets.length = 0; // Reset time offsets

  const radius = 40;  // Sphere radius
  const pointCount = 3000;  // Number of points for the sphere (adjustable)

  // Create initial positions far out of view, behind the camera
  for (let i = 0; i < pointCount; i++) {
    const posX = (Math.random() - 0.5) * 500;
    const posY = (Math.random() - 0.5) * 500;
    const posZ = (Math.random() - 0.5) * 500;

    points.push(posX, posY, posZ);
    initialPositions.push({ x: posX, y: posY, z: posZ });
    timeOffsets.push(0); // Reset time offsets
  }

  const vertices = new Float32Array(points);
  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  if (pointCloud) {
    scene.remove(pointCloud);  // Remove old pointCloud if necessary
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // Animate towards sphere
  const targetPoints = [];
  for (let i = 0; i < pointCount; i++) {
    const theta = Math.random() * Math.PI * 2;  // Longitude angle
    const phi = Math.acos(1 - 2 * Math.random());  // Latitude angle

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    targetPoints.push(x, y, z);
  }

  animateSphereTransition(points, targetPoints);
}

function animateSphereTransition(initialPoints, targetPoints) {
  const duration = 1000; // 1 second for transition
  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progression between 0 and 1

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < initialPoints.length; i += 3) {
      positions[i] = THREE.MathUtils.lerp(initialPoints[i], targetPoints[i], t); // X
      positions[i + 1] = THREE.MathUtils.lerp(initialPoints[i + 1], targetPoints[i + 1], t); // Y
      positions[i + 2] = THREE.MathUtils.lerp(initialPoints[i + 2], targetPoints[i + 2], t); // Z
    }

    geometry.attributes.position.needsUpdate = true;

    if (t < 1) {
      requestAnimationFrame(animate); // Continue until the animation is complete
    }
  }

  animate();
}

// Function to revert points to cube
export function revertToCube(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  setTimeout(() => {
    const initialCubePositions = [];  // Target positions for the cube
    const currentPositions = geometry.attributes.position.array; // Current point positions

    // Create cube positions while keeping the same number of points as the sphere
    const totalPoints = points.length;  // Ensure point count stays constant
    let index = 0;

    for (let z = 0; z < gridSizeZ; z++) {
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (index >= totalPoints) break;  // Ensure we don't exceed the total point count

          const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
          const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
          const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

          initialCubePositions.push(posX, posY, posZ);
          index++;
        }
      }
    }

    // Reposition unused points out of view (behind the camera for example)
    while (index < totalPoints) {
      initialCubePositions.push(1000, 1000, 1000);  // Position unused points out of view
      index++;
    }

    // Start animation to transform points back into a cube
    animateSphereToCube(initialCubePositions, currentPositions);

    // Once the animation is complete, reposition all points to their correct place
    setTimeout(() => {
      initialPositions.length = 0;
      for (let i = 0; i < initialCubePositions.length; i += 3) {
        initialPositions.push({
          x: initialCubePositions[i],
          y: initialCubePositions[i + 1],
          z: initialCubePositions[i + 2]
        });
      }

      // Ensure geometry is properly updated
      geometry.attributes.position.needsUpdate = true;

    }, 300);  // Wait until the transition ends (1 second duration)

  }, 100); // 100ms delay before starting the transition
}

// Animation pour interpoler les points vers la forme du cube
function animateSphereToCube(targetPoints, currentPoints) {
  const duration = 300; // Durée de l'animation (1 secondes)
  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progression entre 0 et 1

    const positions = geometry.attributes.position.array;

    // Assurer une transition douce de chaque point
    for (let i = 0; i < targetPoints.length; i += 3) {
      positions[i] = THREE.MathUtils.lerp(currentPoints[i], targetPoints[i], t); // X
      positions[i + 1] = THREE.MathUtils.lerp(currentPoints[i + 1], targetPoints[i + 1], t); // Y
      positions[i + 2] = THREE.MathUtils.lerp(currentPoints[i + 2], targetPoints[i + 2], t); // Z
    }

    geometry.attributes.position.needsUpdate = true;

    if (t < 1) {
      requestAnimationFrame(animate); // Continuer l'animation tant que t est inférieur à 1
    } else {
      // Assurer que toutes les positions ont été mises à jour à la fin de l'animation
      for (let i = 0; i < targetPoints.length; i += 3) {
        positions[i] = targetPoints[i]; // X
        positions[i + 1] = targetPoints[i + 1]; // Y
        positions[i + 2] = targetPoints[i + 2]; // Z
      }
      geometry.attributes.position.needsUpdate = true;
    }
  }

  animate();
}



