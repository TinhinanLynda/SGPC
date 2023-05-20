import * as THREE from 'https://cdn.skypack.dev/three@0.124.0';
import { RGBELoader  } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/AfterimagePass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/ShaderPass.js';
import { PixelShader } from 'https://cdn.skypack.dev/three@0.124.0/examples/jsm/shaders/PixelShader.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/FBXLoader.js';

let composer;

let model1;

var renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true});

// default bg canvas color //
renderer.setClearColor(0x11151c);

//  use device aspect ratio //
renderer.setPixelRatio(window.devicePixelRatio);

// set size of canvas within window //
renderer.setSize(window.innerWidth, window.innerHeight);

var scene = new THREE.Scene();

const hdrEquirect = new RGBELoader()
	.setPath( 'https://miroleon.github.io/daily-assets/' )
	.load( 'gradient_13.hdr', function () {

  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
} );

scene.environment = hdrEquirect;
scene.fog = new THREE.Fog( 0x11151c, 1, 100 );
scene.fog = new THREE.FogExp2(0x11151c, 0.14);

var theta1 = 0;

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 10;
camera.position.y = 0.2;

const pointlight = new THREE.PointLight (0x85ccb8, 2, 20);
pointlight.position.set (0,3,2);
scene.add (pointlight);

const pointlight2 = new THREE.PointLight (0x85ccb8, 2, 20);
pointlight2.position.set (0,3,2);
scene.add (pointlight2);

const textureLoader = new THREE.TextureLoader();

var surf_imp = textureLoader.load( 'https://miroleon.github.io/daily-assets/surf_imp_02.jpg' );
surf_imp.wrapT = THREE.RepeatWrapping;
surf_imp.wrapS = THREE.RepeatWrapping;

var hand_mat = new THREE.MeshPhysicalMaterial({
color: 0xffffff,
roughness: 1,
metalness: 1,
roughnessMap: surf_imp,
transparent: true,
opacity: 1});

const loaderFBX1 = new FBXLoader().setPath( 'https://miroleon.github.io/daily-assets/' );
loaderFBX1.load( 'MASK_02.fbx', function ( object ) {

model1 = object.children[ 0 ];
model1.position.set( 0, -0.2, 0 );
model1.scale.setScalar( 2 );
model1.material = hand_mat;
scene.add( model1 );
} );

// POST PROCESSING
const renderScene = new RenderPass( scene, camera );

const afterimagePass = new AfterimagePass();
afterimagePass.uniforms[ 'damp' ].value = 0.95;

const bloomparams = {
	exposure: 1,
	bloomStrength: 1,
	bloomThreshold: 0.1,
	bloomRadius: 1
};

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloomparams.bloomThreshold;
bloomPass.strength = bloomparams.bloomStrength;
bloomPass.radius = bloomparams.bloomRadius;

const pixelPass = new ShaderPass( PixelShader );
pixelPass.uniforms[ 'resolution' ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
pixelPass.uniforms[ 'resolution' ].value.multiplyScalar( window.devicePixelRatio );
pixelPass.uniforms[ 'pixelSize' ].value = 20;

composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( afterimagePass );
composer.addPass( bloomPass );
// composer.addPass( pixelPass );

// RESIZE
window.addEventListener( 'resize', onWindowResize );


var update = function() {
  theta1 += 0.007;

  camera.position.x = Math.sin( theta1 ) * 2;
  camera.position.y = 2.5*Math.cos( theta1 ) + 1;

  pointlight.position.x = Math.sin( theta1+1 ) * 11;
  pointlight.position.z = Math.cos( theta1+1 ) * 11;
  pointlight.position.y = 2*Math.cos( theta1-3 ) +3;
  
  pointlight2.position.x = -Math.sin( theta1+1 ) * 11;
  pointlight2.position.z = -Math.cos( theta1+1 ) * 11;
  pointlight2.position.y = 2*-Math.cos( theta1-3 ) -6;

	camera.lookAt( 0, 0, 0 );
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
  update();
  composer.render();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);