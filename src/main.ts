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
  'axiom' : "t[.b][+b][*b]",
  'iterations': 2,
  'rotationAngle': 30,
  'Generate': loadScene,
};

let icosphere: Icosphere;
let square: Square;
let base: Cube;
let plant: Plant;
let time: number = 0;


function loadScene() {
  plant = new Plant(vec3.fromValues(0, 0, 0), stem, leaf, "t[.b][+b][*b]", controls.iterations.valueOf(), controls.rotationAngle.valueOf());
  plant.buildShape();
  plant.branchLoader.create();
  // modified cube to be plant base
  base = new Cube(vec3.fromValues(0, 2, 0));
  base.create();
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
 var iterations = gui.add(controls, 'iterations', 0, 5).step(1);
 var rotationAngle = gui.add(controls, 'rotationAngle', 0, 90);
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

  const camera = new Camera(vec3.fromValues(0, 2, 8), vec3.fromValues(0, 0, 0));

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
       plant.branchLoader,
       base, 
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
