import {vec3, vec4} from 'gl-matrix';
//import Drawable from '../rendering/gl/Drawable';
//import {gl} from '../globals';

class DrawingRules{//} extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;

  constructor(center: vec3) {
   // super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  
}