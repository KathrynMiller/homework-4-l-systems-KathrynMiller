import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Turtle from '../Turtle';
import Grammar from '../Grammar';
import Cube from './Cube';
import TurtleStack from '../TurtleStack';

class Plant extends Drawable {
  // final vbo arrays
  finalPos: number[] = new Array();
  finalNor: number[] = new Array();
  finalIndices: number[] = new Array();
  finalUVs: number[] = new Array();

  degree: number;
  //leafSize: number;
  leaf: any;
  stem: any;
  lastIndex: number = 0;
  center: vec4;
  depth: number = 1;
  // stack for holding the turtles
  turtleStack: TurtleStack;
  turtle: Turtle;
  // expanded string that defines turtle path
  grammar: Grammar;


// base length and width of branch based on depth of turtle
  addBranch(scale: number) {
    for(let i = 0; i < this.stem.vertices.length; i+=3) {
        let transPos = vec4.fromValues(this.stem.vertices[i], this.stem.vertices[i+ 1], this.stem.vertices[i + 2], 1);
        let transNor = vec4.fromValues(this.stem.vertexNormals[i], this.stem.vertexNormals[i + 1], this.stem.vertexNormals[i + 2], 0);
    
        transPos = vec4.scale(transPos, transPos, scale);
        transPos[3] = 1;
        transPos = vec4.transformMat4(transPos, transPos, this.turtle.getTotalTrans());
        // rotate normals based on turtle rotation
        transNor = vec4.transformMat4(transNor, transNor, this.turtle.getRotation());

        // add transformed positions and normals to the final set of positions
        this.finalPos = this.finalPos.concat([transPos[0], transPos[1], transPos[2], 1]);
        this.finalNor = this.finalNor.concat([transNor[0], transNor[1], transNor[2], 0]);
    }
    for(let i = 0; i < this.stem.textures.length; i+=2) {
        this.finalUVs.push(this.stem.textures[i]);
        this.finalUVs.push(this.stem.textures[i + 1]);
    }
    for(let i = 0; i < this.stem.indices.length; i++) {
        this.finalIndices = this.finalIndices.concat([this.stem.indices[i] + this.lastIndex]);
    }
    this.lastIndex += this.stem.vertices.length / 3;
    this.turtle.move(scale);
    }

    // similar logic to add branch
    addLeaf() {
    let length = .3;
    console.log(length);
    for(let i = 0; i < this.leaf.vertices.length; i+=3) {
        let transPos = vec4.fromValues(this.leaf.vertices[i], this.leaf.vertices[i+ 1], this.leaf.vertices[i + 2], 1);
        let transNor = vec4.fromValues(this.leaf.vertexNormals[i], this.leaf.vertexNormals[i + 1], this.leaf.vertexNormals[i + 2], 0);
        
        transPos = vec4.transformMat4(transPos, transPos, this.turtle.getTotalTrans());
        // rotate normals based on turtle rotation
        transNor = vec4.transformMat4(transNor, transNor, this.turtle.getRotation());

        // add transformed positions and normals to the final set of positions
        this.finalPos = this.finalPos.concat([transPos[0], transPos[1], transPos[2], transPos[3]]);
        this.finalNor = this.finalNor.concat([transNor[0], transNor[1], transNor[2], transNor[3]]);
         this.finalUVs.push(3);
         this.finalUVs.push(3);
    }
    for(let i = 0; i < this.leaf.indices.length; i++) {
        this.finalIndices = this.finalIndices.concat([this.leaf.indices[i] + this.lastIndex]);
    }
    this.lastIndex += this.leaf.vertices.length / 3;
    this.turtle.move(.3);
    }

    
  constructor(center: vec3, stem: any, leaf: any, axiom: string, i: number, degree: number) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.turtleStack = new TurtleStack();
    this.turtle = this.turtleStack.getTurtle();
    this.stem = stem;
    this.leaf = leaf;
    //this.leafSize = leafSize;
    this.degree = degree;
    // create grammar with input axiom
     this.grammar = new Grammar(axiom, i);
  }

  // handles turtle operations
 // construct shape from grammar 
 buildShape() {
    let string = this.grammar.getGrammar();
    for(let i = 0; i < string.length; i++) {
        let scaleFactor = 1.2;
        let scale = 1.0 / Math.pow(scaleFactor, this.depth);
        if(string[i] == "[") {
            // increase depth of turtles
            this.depth++;
            this.turtle = this.turtleStack.addTurtle();
        } else if (string[i] == "]") {
            this.turtle = this.turtleStack.popTurtle();
            this.depth--;
        } else if(string[i] == "b") {
            this.addBranch(scale);
        } else if (string[i] == "f") {
            this.addLeaf();
        } else if (string[i] == "-") {
            this.turtle.rotate(-this.degree, 1, 0, 0);
        } else if (string[i] == "+") {
           this.turtle.rotate(this.degree, 1, 0, 0);
        } else if (string[i] == ">") {
            this.turtle.rotate(this.degree, 0, 1, 0);
        } else if (string[i] == "<") {
            this.turtle.rotate(-this.degree, 0, 1, 0);
        } else if (string[i] == "*") {
            this.turtle.rotate(-this.degree, 0, 0, 1);
        } else if (string[i] == ".") {
            this.turtle.rotate(this.degree, 0, 0, 1);
        } else if (string[i] == "t") {
            this.addBranch(1.5);
        }
    }

 }

  create() {
    this.buildShape(); // create shape from grammar
    var indices = Uint32Array.from(this.finalIndices);
    var normals = Float32Array.from(this.finalNor);
    var positions = Float32Array.from(this.finalPos);
    var uvs = Float32Array.from(this.finalUVs);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateUVs();

    this.count = indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUVs);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  }
};

export default Plant;
