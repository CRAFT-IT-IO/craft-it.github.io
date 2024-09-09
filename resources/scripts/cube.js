export let geometry;
export let pointCloud;
export let points = [];
export let initialPositions = [];
export let timeOffsets = [];
export let gridSize = 12; // grid size in X and Y
export let spacing = 5; // Initial spacing

// Function to create points and update the point cloud
export function createPoints(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  points.length = 0; // Reset points array
  initialPositions.length = 0; // Reset initial positions array

  geometry = new THREE.BufferGeometry();

  // Create grid of points with dynamic spacing and Z grid size
  for (let z = 0; z < gridSizeZ; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

        points.push(posX, posY, posZ);
        initialPositions.push({ x: posX, y: posY, z: posZ });
        timeOffsets.push(0); // Reset time offsets
      }
    }
  }

  const vertices = new Float32Array(points);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  // If pointCloud exists, remove it before recreating
  if (pointCloud) {
    scene.remove(pointCloud);
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

export function updatePoints(mouseX, mouseY, isMouseInside, easeInOut) {
  const positions = geometry.attributes.position.array;
  const timeFactor = 0.06;

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];
    const distanceX = mouseX - initialPosition.x;
    const distanceY = mouseY - initialPosition.y;

    // Ensure x, y, z are valid numbers
    if (isNaN(initialPosition.x) || isNaN(initialPosition.y) || isNaN(initialPosition.z)) {
      console.error('NaN value detected in initial positions:', initialPosition);
      continue; // Skip updating if invalid values are detected
    }

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const maxDistance = 30;
    const influence = Math.max(0, maxDistance - distance) / maxDistance;

    if (isMouseInside && influence > 0) {
      timeOffsets[i / 3] = Math.min(timeOffsets[i / 3] + timeFactor, 1);
    } else {
      timeOffsets[i / 3] = Math.max(timeOffsets[i / 3] - timeFactor * 0.5, 0);
    }

    const easeValue = easeInOut(timeOffsets[i / 3]);
    const waveEffect = Math.sin(distance * 0.2 + performance.now() * 0.005) * influence * 2 * easeValue;

    positions[i + 2] = initialPosition.z + waveEffect;

    if (isNaN(positions[i + 2])) {
      console.error('NaN value detected in geometry positions at index', i);
      positions[i + 2] = initialPosition.z; // Reset to initial Z if NaN is detected
    }
  }

  geometry.attributes.position.needsUpdate = true;
}


