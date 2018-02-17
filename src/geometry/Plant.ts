import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Turtle from '../Turtle';
import Grammar from '../Grammar';
import Cube from './Cube';


class Plant extends Drawable {

  // used when modifying obj attributes of a stem 
  stemIndices: number[] = new Array();
  stemPositions: number[][] = new Array<Array<number>>();
  stemNormals: number[][] = new Array<Array<number>>();
  // final vbo arrays
  finalPos: number[] = new Array();
  finalNor: number[] = new Array();
  finalIndices: number[] = new Array();

  lastIndex: number = 0;
  center: vec4;
  turtle: Turtle;
  // stack for holding the turtles
  turtleStack: Turtle[] = new Array();
  // expanded string that defines turtle path
  grammar: Grammar;

  // fix later to use an actual obj loader
loadObjs() {
    // cube for testing
    this.stemIndices = [0, 1, 2,
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,
        8, 9, 10,
        8, 10, 11,
        12, 13, 14,
        12, 14, 15,
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23];
this.stemNormals = [[0, 0, 1, 0],
         [0, 0, 1, 0],
         [0, 0, 1, 0],
         [0, 0, 1, 0],
        
         [0, 0, -1, 0],
         [0, 0, -1, 0],
         [0, 0, -1, 0],
         [0, 0, -1, 0],
        
         [1, 0, 0, 0],
         [1, 0, 0, 0],
         [1, 0, 0, 0],
         [1, 0, 0, 0],
        
         [-1, 0, 0, 0],
         [-1, 0, 0, 0],
         [-1, 0, 0, 0],
         [-1, 0, 0, 0],
        
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
         [0, 1, 0, 0],
        
         [0, -1, 0, 0],
         [0, -1, 0, 0],
         [0, -1, 0, 0],
         [0, -1, 0, 0]];
this.stemPositions = [[-.25, -1, 0, 1],
           [.25, -1, 0, 1],
           [.25, 1, 0, 1],
           [-.25, 1, 0, 1],

           [-.25, -1, -.5, 1],
           [.25, -1, -.5, 1],
           [.25, 1, -.5, 1], 
           [-.25, 1, -.5, 1],

           [.25, -1, 0, 1],
          [.25, -1, -.5, 1],
            [.25, 1, -.5, 1],
            [.25, 1, 0, 1],

            [-.25, -1, 0, 1],
            [-.25, -1, -.5, 1],
            [-.25, 1, -.5, 1],
            [-.25, 1, 0, 1],

            [-.25, 1, 0, 1],
            [.25, 1, 0, 1],
            [.25, 1, -.5, 1],
            [-.25, 1, -.5, 1],

            [-.25, -1, 0, 1],
            [.25, -1, 0, 1],
            [.25, -1, -.5, 1],
            [-.25, -1, -.5, 1]];




}

// set of functions to map grammar to
  mapMinus() {
      this.turtle.rotateZ(-30);
  }

  mapPlus() {
    this.turtle.rotateZ(30);
}
// base length and width of branch based on depth of turtle
  mapB() {
      console.log("ADD BRANCH");
    // modify later
    let length = 1;
    for(let i = 0; i < this.stemPositions.length; i++) {
        let transPos = vec4.create();
        let transNor = vec4.create();
        // rotate the branch positions
        transPos = vec4.transformMat4(transPos, this.stemPositions[i], this.turtle.getRotation());
        // move base to turtle's position
        vec4.add(transPos, transPos, this.turtle.getPos());
        transPos[3] = 1;

       // console.log("translated Pos: " + transPos);
        // rotate normals based on turtle rotation
        transNor = vec4.transformMat4(transNor, this.stemNormals[i], this.turtle.getRotation());
        // add transformed positions and normals to the final set of positions
        this.finalPos.push(transPos[0]);
        this.finalPos.push(transPos[1]);
        this.finalPos.push(transPos[2]);
        this.finalPos.push(transPos[3]);
        this.finalNor.push(transNor[0]);
        this.finalNor.push(transNor[1]);
        this.finalNor.push(transNor[2]);
        this.finalNor.push(transNor[3]);
    }

    for(let i = 0; i < this.stemIndices.length; i++) {
            this.finalIndices.push(this.stemIndices[i] + this.lastIndex);
    }
    this.lastIndex += this.stemPositions.length;
    // move turtle to end of new branch
    this.turtle.move(length);

    }

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.turtle = new Turtle(vec4.fromValues(0, 0, 0, 1), vec4.fromValues(0, 1, 0, 1), mat4.create(), 0);
    // fill stem mini-vbo data
    this.loadObjs();
    // create grammar with input axiom
    this.grammar = new Grammar("b-", 1);
  }

  // handles turtle operations
 // construct shape from grammar 
 buildShape() {
    let string = this.grammar.getGrammar();
    for(let i = 0; i < string.length; i++) {
        if(string[i] == "[") { // push turtle to stack and create new one at current position
            // increase depth of turtles
            this.turtle.incDepth();
            this.turtleStack.push(this.turtle);
            let newTurtle = new Turtle(this.turtle.getPos(), this.turtle.getOrientation(), this.turtle.getRotation(), this.turtle.getDepth());
            this.turtle = newTurtle;
        } else if (string[i] == "]") {
            this.turtle = this.turtleStack.pop();
            // only need to increase depth of the saved turtle because the new turtle is gone now
            this.turtle.decDepth();
        } else if(string[i] == "b") {
            this.mapB();
        } else if (string[i] == "-") {
            this.mapMinus();
        } else if (string[i] == "+") {
            this.mapPlus();
        }
    }

 }


  create() {
    
    this.buildShape(); // create shape from grammar
  var indices = Uint32Array.from(this.finalIndices);
  var normals = Float32Array.from(this.finalNor);
  var positions = Float32Array.from(this.finalPos);
console.log(indices);
console.log(positions);
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
