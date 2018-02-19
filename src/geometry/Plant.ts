import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Turtle from '../Turtle';
import Grammar from '../Grammar';
import Cube from './Cube';
import TurtleStack from '../TurtleStack';
import objLoader from '../objLoader';

class Plant extends Drawable {

  // used when modifying obj attributes of a stem 
  stemIndices: number[] = new Array();
  stemPositions: number[][] = new Array<Array<number>>();
  stemNormals: number[][] = new Array<Array<number>>();
  // single leaf attributes
  leafIndices: number[] = new Array();
  leafPositions: number[][] = new Array<Array<number>>();
  leafNormals: number[][] = new Array<Array<number>>();
  // final vbo arrays
  finalPos: number[] = new Array();
  finalNor: number[] = new Array();
  finalIndices: number[] = new Array();

  lastIndex: number = 0;
  center: vec4;
  depth: number = 1;
  // stack for holding the turtles
  turtleStack: TurtleStack;
  turtle: Turtle;
  // expanded string that defines turtle path
  grammar: Grammar;
  objLoader: objLoader = new objLoader();

// set of functions to map grammar to
//TODO add randomness to rotations 
  mapMinus() {
      let rand = Math.random();
      if(rand < .5) {
        this.turtle.rotate(-30, 1, 0, 0);
      } else {
        this.turtle.rotate(-30, 0, 0, 1);
      } 
  }

  mapPlus() {
    let rand = Math.random();
    if(rand < .5) {
        this.turtle.rotate(30, 1, 0, 0);
      } else {
        this.turtle.rotate(30, 0, 0, 1);
      } 
}
// only use rotY after an x or z rotation to avoid weird twisted overlapping line
rotY() {
    let rand = Math.random();
      if(rand < .5) {
        this.turtle.rotate(-30, 0, 1, 0);
      } else{
        this.turtle.rotate(30, 0, 1, 0);
      }
}
// base length and width of branch based on depth of turtle
  addBranch() {
    // modify later
    let scaleFactor = 1.2;
    let length = 1.0;
    let scale = 1.0 / Math.pow(scaleFactor, this.depth);
    for(let i = 0; i < this.stemPositions.length; i++) {
        let transPos = vec4.fromValues(this.stemPositions[i][0], this.stemPositions[i][1], this.stemPositions[i][2], 1);
        let transNor = vec4.create();
    
        transPos = vec4.scale(transPos, transPos, scale);
        transPos[3] = 1;
        // rotate the branch positions
        transPos = vec4.transformMat4(transPos, transPos, this.turtle.getRotation());
        // move base to turtle's position
        //vec4.scale(transPos, this.turtle.getOrientation(), length);
        vec4.add(transPos, transPos, this.turtle.getPos());
        transPos[3] = 1;

        // rotate normals based on turtle rotation
        transNor = vec4.transformMat4(transNor, this.stemNormals[i], this.turtle.getRotation());

        // add transformed positions and normals to the final set of positions
        this.finalPos = this.finalPos.concat([transPos[0], transPos[1], transPos[2], transPos[3]]);
        this.finalNor = this.finalNor.concat([transNor[0], transNor[1], transNor[2], transNor[3]]);
    }
    // adjust indices and add to final list
    for(let i = 0; i < this.stemIndices.length; i++) {
            this.finalIndices.push(this.stemIndices[i] + this.lastIndex);
    }
    
    this.lastIndex += this.stemPositions.length;

    // move turtle to end of new branch
    this.turtle.move(scale);

    }

    // similar logic to add branch
    addLeaf() {
    let length = .1;
    for(let i = 0; i < this.leafPositions.length; i++) {
        let transPos = vec4.fromValues(this.leafPositions[i][0], this.leafPositions[i][1], this.leafPositions[i][2], 1);
        let transNor = vec4.create();
        
        // rotate the leaf positions
        transPos = vec4.transformMat4(transPos, this.leafPositions[i], this.turtle.getRotation());
        // move base to turtle's position
        //vec4.scale(transPos, this.turtle.getOrientation(), length);
        vec4.add(transPos, transPos, this.turtle.getPos());
        transPos[3] = 1;

        // rotate normals based on turtle rotation
        transNor = vec4.transformMat4(transNor, this.leafNormals[i], this.turtle.getRotation());

        // add transformed positions and normals to the final set of positions
        this.finalPos = this.finalPos.concat([transPos[0], transPos[1], transPos[2], transPos[3]]);
        this.finalNor = this.finalNor.concat([transNor[0], transNor[1], transNor[2], transNor[3]]);
    }
    // adjust indices and add to final list
    for(let i = 0; i < this.leafIndices.length; i++) {
            this.finalIndices.push(this.leafIndices[i] + this.lastIndex);
    }
    this.lastIndex += this.leafPositions.length;

    // move turtle to end of new branch
    this.turtle.move(length);
    }

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.turtleStack = new TurtleStack();
    this.turtle = this.turtleStack.getTurtle();
    // fill stem mini-vbo data
    this.objLoader.load("src/objs/stem.obj");
    this.stemPositions = this.objLoader.getPositions();
    this.stemIndices = this.objLoader.getIndices();
    this.stemNormals = this.objLoader.getNormals();
    console.log("POS LENGTH: " + this.stemPositions.length);
    console.log("NOR LENGTH: " + this.stemNormals.length);
    console.log("IDX LENGTH: " + this.stemIndices.length);
    this.objLoader.load("src/objs/leaf.obj");
    this.leafPositions = this.objLoader.getPositions();
    this.leafIndices = this.objLoader.getIndices();
    this.leafNormals = this.objLoader.getNormals();
    // create grammar with input axiom
    this.grammar = new Grammar("b[-b]+b", 2);
  }

  // handles turtle operations
 // construct shape from grammar 
 buildShape() {
    // let string = "b";
    let string = this.grammar.getGrammar();
    for(let i = 0; i < string.length; i++) {
        if(string[i] == "[") {
            // increase depth of turtles
            this.depth++;
            this.turtle = this.turtleStack.addTurtle();
        } else if (string[i] == "]") {
            this.turtle = this.turtleStack.popTurtle();
            this.depth--;
        } else if(string[i] == "b") {
            this.addBranch();
        } else if (string[i] == "-") {
            this.mapMinus();
        } else if (string[i] == "+") {
            this.mapPlus();
        } else if (string[i] == "^") {
            this.rotY();
        } else if (string[i] == "f") {
            this.addLeaf();
        }
    }

 }


  create() {
    this.buildShape(); // create shape from grammar
  var indices = Uint32Array.from(this.finalIndices);
  var normals = Float32Array.from(this.finalNor);
  var positions = Float32Array.from(this.finalPos);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
};

export default Plant;
