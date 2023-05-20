let scene, camera, renderer, controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;

  const loader = new THREE.GLTFLoader();
  loader.load(
    "aaa.glb",
    function (gltf) {
      const model = gltf.scene;
      scene.add(model);
      model.position.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      controls.target.copy(center);
      controls.update();
    },
    undefined,
    function (error) {
      console.error("Error loading GLB file:", error);
    }
  );

  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
