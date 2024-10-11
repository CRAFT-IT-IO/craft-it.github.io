export let geometry;
export let pointCloud;
export let points = [];
export let initialPositions = [];
export let timeOffsets = [];
export let gridSize = 12; // grid size in X and Y
export let spacing = 5; // Initial spacing

// Function to create points and update the point cloud (cube form)
export function createPoints(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  points.length = 0; // Réinitialiser le tableau des points
  initialPositions.length = 0; // Réinitialiser les positions initiales
  timeOffsets.length = 0; // Réinitialiser les décalages de temps

  geometry = new THREE.BufferGeometry();

  // Créer une grille de points avec un espacement dynamique et une taille de grille Z
  for (let z = 0; z < gridSizeZ; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

        points.push(posX, posY, posZ);
        initialPositions.push({ x: posX, y: posY, z: posZ });
        timeOffsets.push(0); // Réinitialiser les décalages de temps
      }
    }
  }

  const vertices = new Float32Array(points);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  if (pointCloud) {
    scene.remove(pointCloud);
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Function to update points based on mouse influence (wave effect)
export function updatePoints() {
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];

    // Vérifier que initialPosition est bien défini
    if (!initialPosition || initialPosition.x === undefined || initialPosition.y === undefined || initialPosition.z === undefined) {
      console.error('Initial position is undefined for index', i / 3);
      continue;  // Sauter l'itération si initialPosition est indéfini
    }

    // Remettre les points à leur position initiale sans aucune influence
    positions[i + 2] = initialPosition.z;  // Restaurer la position initiale des points sur l'axe Z

    if (isNaN(positions[i + 2])) {
      console.error('NaN value detected in geometry positions at index', i);
      positions[i + 2] = initialPosition.z;  // Reset to initial Z if NaN is detected
    }
  }

  geometry.attributes.position.needsUpdate = true;  // Indiquer que la géométrie a été mise à jour
}


// Function to transform points into a sphere with denser points at the poles
export function transformToSphere(scene, material) {
  points.length = 0;  // Réinitialiser les points
  initialPositions.length = 0;  // Réinitialiser les positions initiales
  timeOffsets.length = 0; // Réinitialiser les décalages de temps

  const radius = 40;  // Rayon de la sphère
  const pointCount = 3000;  // Nombre de points pour la sphère (peut être ajusté)

  // Créer des positions initiales loin de la vue, derrière la caméra
  for (let i = 0; i < pointCount; i++) {
    const posX = (Math.random() - 0.5) * 500;
    const posY = (Math.random() - 0.5) * 500;
    const posZ = (Math.random() - 0.5) * 500;

    points.push(posX, posY, posZ);
    initialPositions.push({ x: posX, y: posY, z: posZ });
    timeOffsets.push(0); // Réinitialiser les décalages de temps
  }

  const vertices = new Float32Array(points);
  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  if (pointCloud) {
    scene.remove(pointCloud);  // Supprimer l'ancien pointCloud si nécessaire
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // Animation vers la sphère
  const targetPoints = [];
  for (let i = 0; i < pointCount; i++) {
    const theta = Math.random() * Math.PI * 2;  // Angle de longitude
    const phi = Math.acos(1 - 2 * Math.random());  // Angle de latitude

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    targetPoints.push(x, y, z);
  }

  animateSphereTransition(points, targetPoints);
}


function animateSphereTransition(initialPoints, targetPoints) {
  const duration = 1000; // 1 secondes pour la transition
  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progression entre 0 et 1

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < initialPoints.length; i += 3) {
      positions[i] = THREE.MathUtils.lerp(initialPoints[i], targetPoints[i], t); // X
      positions[i + 1] = THREE.MathUtils.lerp(initialPoints[i + 1], targetPoints[i + 1], t); // Y
      positions[i + 2] = THREE.MathUtils.lerp(initialPoints[i + 2], targetPoints[i + 2], t); // Z
    }

    geometry.attributes.position.needsUpdate = true;

    if (t < 1) {
      requestAnimationFrame(animate); // Continuer jusqu'à la fin de l'animation
    }
  }

  animate();
}

// Function to revert points to cube
export function revertToCube(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  setTimeout(() => {
    const initialCubePositions = [];  // Positions cibles pour le cube
    const currentPositions = geometry.attributes.position.array; // Positions actuelles des points

    // Créer les positions du cube en gardant le même nombre de points que la sphère
    const totalPoints = points.length;  // Assurer que le nombre de points reste constant
    let index = 0;

    for (let z = 0; z < gridSizeZ; z++) {
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (index >= totalPoints) break;  // S'assurer qu'on ne dépasse pas le nombre total de points

          const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
          const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
          const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

          initialCubePositions.push(posX, posY, posZ);
          index++;
        }
      }
    }

    // Si des points supplémentaires existent, les repositionner hors de la vue (derrière la caméra par exemple)
    while (index < totalPoints) {
      initialCubePositions.push(1000, 1000, 1000);  // Positionner les points inutilisés hors de vue
      index++;
    }

    // Lancer l'animation pour transformer les points en cube
    animateSphereToCube(initialCubePositions, currentPositions);

    // Une fois l'animation terminée, repositionner tous les points à leur place correcte
    setTimeout(() => {
      initialPositions.length = 0;
      for (let i = 0; i < initialCubePositions.length; i += 3) {
        initialPositions.push({
          x: initialCubePositions[i],
          y: initialCubePositions[i + 1],
          z: initialCubePositions[i + 2]
        });
      }

      // Assurer que la géométrie est correctement mise à jour
      geometry.attributes.position.needsUpdate = true;

    }, 300);  // Attendre la fin de la transition (durée de 1 seconde)

  }, 100); // Délai de 100ms avant de commencer la transition
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

