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
import FallingLoader from './geometry/FallingLoader';
import ObjLoader from './geometry/ObjLoader';

var OBJ = require('webgl-obj-loader');
let stem: object;
let leaf: object;
let base: object;
let floor: object;
window.onload = function() {
  OBJ.downloadMeshes({
    'stem': './src/objs/stem.obj',
    'leaf': './src/objs/leaf.obj',
    'base': './src/objs/base.obj',
    'floor': './src/objs/floor.obj'
  }, function(meshes: any) {
    stem = meshes.stem;
    leaf = meshes.leaf;
    base = meshes.base;
    floor = meshes.floor;
    main2();
  });
}


// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  'axiom' : "t[.b][+b][*b][-b][<*b]",
  'iterations': 7,
  'rotationAngle': 30,
  'leafColor' : [233.0, 200.0, 91.0, 1],
  'fallingLeaves' : false,
  'Generate': loadScene,
};

let icosphere: Icosphere;
let square: Square;
//let base: Cube;
let plant: Plant;
let fallingLoader: FallingLoader;
let baseLoader: ObjLoader;
let floorLoader: ObjLoader;
let time: number = 0;


function loadScene() {
  plant = new Plant(vec3.fromValues(0, 0, 0), stem, leaf, controls.axiom.valueOf(), controls.iterations.valueOf(), controls.rotationAngle.valueOf());
  plant.buildShape();
  plant.branchLoader.create();
  plant.leafLoader.create();
  fallingLoader = new FallingLoader(leaf, plant.minPos, plant.maxPos, 20);
  fallingLoader.create();

 // make the base
 // baseLoader = new ObjLoader(base, vec3.fromValues(194 / 255, 202 / 255, 201 / 255)); // silver
  baseLoader = new ObjLoader(base, vec3.fromValues(108 / 255, 88 / 255, 75 / 255)); // brown
  baseLoader.create();
  // make the floor 
  floorLoader = new ObjLoader(floor, vec3.fromValues(90 / 255, 138 / 255, 120 / 255));

  floorLoader.create();

}

// fix for loader being called after main
function main() {}

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
 var axiom = gui.add(controls, 'axiom');
 var iterations = gui.add(controls, 'iterations', 0, 10).step(1);
 var rotationAngle = gui.add(controls, 'rotationAngle', 0, 90);
 var color = gui.addColor(controls, 'leafColor');
 var fallingLeaves = gui.add(controls, 'fallingLeaves');
 gui.add(controls, 'Generate');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  

  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  loadScene();

  const camera = new Camera(vec3.fromValues(0, 3, 8), vec3.fromValues(0, 1, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);


  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const leafLambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.1.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.1.glsl')),
  ]);
  const fallingLambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.2.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.2.glsl')),
  ]);
  leafLambert.setGeometryColor(vec4.fromValues(controls.leafColor[0]/255.0,controls.leafColor[1]/255.0, controls.leafColor[2]/255.0, 1.0));
  fallingLambert.setGeometryColor(vec4.fromValues(controls.leafColor[0]/255.0,controls.leafColor[1]/255.0, controls.leafColor[2]/255.0, 1.0));

  const objLambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.3.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.3.glsl')),
  ]);

  // initialize time in shader
  lambert.setTime(time);
  leafLambert.setTime(time);
  fallingLambert.setTime(time);
  time++;
  
  // This function will be called every frame
  function tick() {
    camera.update();
    
    lambert.setTime(time);
    leafLambert.setTime(time);
    fallingLambert.setTime(time);
    time++; 

    color.onChange(function(value: vec4) {
      leafLambert.setGeometryColor(vec4.fromValues(controls.leafColor[0]/255.0,controls.leafColor[1]/255.0, controls.leafColor[2]/255.0, 1.0));
      fallingLambert.setGeometryColor(vec4.fromValues(controls.leafColor[0]/255.0,controls.leafColor[1]/255.0, controls.leafColor[2]/255.0, 1.0));
    });

    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
  
    renderer.render(camera, lambert, [
       plant.branchLoader,
      // base, 
      // square
    ]);

    renderer.render(camera, leafLambert, [
      plant.leafLoader,
     // fallingLoader,
   ]);
   if(controls.fallingLeaves.valueOf() == true) {
    renderer.render(camera, fallingLambert, [
      fallingLoader,
    ]);
   }

   renderer.render(camera, objLambert, [
    baseLoader,
    floorLoader,
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
