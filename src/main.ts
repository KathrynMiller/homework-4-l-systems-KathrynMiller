import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Plant from './geometry/Plant';
import objLoader from './objLoader';

var OBJ = require('webgl-obj-loader');
let stem: object;
let leaf: object;
window.onload = function() {
  OBJ.downloadMeshes({
    'stem': './src/objs/stem.obj',
    'leaf': './src/objs/leaf.obj'
  }, function(meshes: any) {
    stem = meshes.stem;
    leaf = meshes.leaf;
    main2();
  });
}

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  // create new plant with current settings when pressed
  'regenerate': regenerate, // A function pointer, essentially
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let plant: Plant;
let time: number = 0;
let loader = new objLoader(); 

function loadScene() {
  console.log("use stem");
  plant = new Plant(vec3.fromValues(0, 0, 0), stem, leaf);
  plant.create();
}

function regenerate() {
  plant.destory;
  plant.create();
}

function main() {

}

function main2() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'regenerate');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }

  /*
  //TODO FIX TEXTURE
  // load texture???
  const texture = loader.loadTexture(gl, 'src/objs/birch.jpg');
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  */

  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

 
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  // initialize time in shader
  lambert.setTime(time);
  time++;
  
  // This function will be called every frame
  function tick() {
    camera.update();
    
    lambert.setTime(time);
    time++;


    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
  
    renderer.render(camera, lambert, [
       plant,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
