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
  stemUVs: number[][] = new Array<Array<number>>();
  // single leaf attributes
  leafIndices: number[] = new Array();
  leafPositions: number[][] = new Array<Array<number>>();
  leafNormals: number[][] = new Array<Array<number>>();
  // final vbo arrays
  finalPos: number[] = new Array();
  finalNor: number[] = new Array();
  finalIndices: number[] = new Array();
  finalUVs: number[] = new Array();

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
  objLoader: objLoader = new objLoader();

// base length and width of branch based on depth of turtle
  addBranch() {
        let scaleFactor = 1.2;
        let length = 1.0;
        let scale = 1.0 / Math.pow(scaleFactor, this.depth);
        for(let i = 0; i < this.stemPositions.length; i++) {
            let transPos = vec4.fromValues(this.stemPositions[i][0], this.stemPositions[i][1], this.stemPositions[i][2], 1);
            let transNor = vec4.create();
        
            transPos = vec4.scale(transPos, transPos, scale);
            transPos[3] = 1;
            transPos = vec4.transformMat4(transPos, transPos, this.turtle.getTotalTrans());
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

        for(let i = 0; i < this.stemUVs.length; i++) {
            this.finalUVs.push(this.stemUVs[i][0]);
            this.finalUVs.push(this.stemUVs[i][1]);
        }

        // move turtle to end of new branch
        //this.turtle.setScale(scale);
        this.turtle.move(scale);
    }

    // similar logic to add branch
    addLeaf() {
        let length = .3;
        for(let i = 0; i < this.leafPositions.length; i++) {
            let transPos = vec4.fromValues(this.leafPositions[i][0], this.leafPositions[i][1], this.leafPositions[i][2], 1);
            let transNor = vec4.create();
            
            // rotate the leaf positions
            transPos = vec4.transformMat4(transPos, this.leafPositions[i], this.turtle.getRotation());
            // move base to turtle's position

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
        //this.turtle.setScale(.3);
        this.turtle.move(length);
    }

    trunk() {
        let scale = 1.5;
        for(let i = 0; i < this.stemPositions.length; i++) {
            let transPos = vec4.fromValues(this.stemPositions[i][0], this.stemPositions[i][1], this.stemPositions[i][2], 1);
            let transNor = vec4.fromValues(this.stemNormals[i][0], this.stemNormals[i][1], this.stemNormals[i][2], 0);
        
            transPos = vec4.scale(transPos, transPos, scale);
            transPos[3] = 1;
            transPos = vec4.transformMat4(transPos, transPos, this.turtle.getTotalTrans());

            // add transformed positions and normals to the final set of positions
            this.finalPos = this.finalPos.concat([transPos[0], transPos[1], transPos[2], transPos[3]]);
            this.finalNor = this.finalNor.concat([transNor[0], transNor[1], transNor[2], transNor[3]]);
        }
        // adjust indices and add to final list
        for(let i = 0; i < this.stemIndices.length; i++) {
            this.finalIndices.push(this.stemIndices[i] + this.lastIndex);
        }
        this.lastIndex += this.stemPositions.length;
        for(let i = 0; i < this.stemUVs.length; i++) {
            this.finalUVs.push(this.stemUVs[i][0]);
            this.finalUVs.push(this.stemUVs[i][1]);
        }
        // move turtle to end of new branch
      //  this.turtle.setScale(scale);
        this.turtle.move(scale);
    }



    
  constructor(center: vec3, stem: any, leaf: any) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.turtleStack = new TurtleStack();
    this.turtle = this.turtleStack.getTurtle();
    this.stem = stem;
    this.leaf = leaf;
    let stemMesh: any = stem;
    let leafMesh: any = leaf;

    for(let i: number = 0; i < stemMesh.indices.length; ++i) {
        this.stemIndices.push(this.lastIndex + stemMesh.indices[i]);
        this.stemNormals.push([stemMesh.vertexNormals[i * 3], stemMesh.vertexNormals[i * 3 + 1], stemMesh.vertexNormals[i * 3 + 2], 0]);
        this.stemPositions.push([stemMesh.vertices[i * 3], stemMesh.vertices[i * 3 + 1], stemMesh.vertices[i * 3 + 2], 1]);
        this.stemUVs.push([stemMesh.textures[i * 2], stemMesh.textures[i * 2 + 1]]);
    }

    for(let i: number = 0; i < leafMesh.indices.length; ++i) {
        this.leafIndices.push(this.lastIndex + leafMesh.indices[i]);
        this.leafNormals.push([leafMesh.vertexNormals[i * 3], leafMesh.vertexNormals[i * 3 + 1], leafMesh.vertexNormals[i * 3 + 2], 0]);
        this.leafPositions.push([leafMesh.vertices[i * 3], leafMesh.vertices[i * 3 + 1], leafMesh.vertices[i * 3 + 2], 1]);
    }
    // create grammar with input axiom
     this.grammar = new Grammar("t[.b][+b][*b]", 3);
  }

  // handles turtle operations
 // construct shape from grammar 
 buildShape() {
    // let string = "t<*b";
    //let string = "t+b[+b]b[-b]";
   //let string = "t+bf[+bf-f]bf[-bf.f]";
     let string = this.grammar.getGrammar();
    for(let i = 0; i < string.length; i++) {
        // let rand = Math.random();
        if(string[i] == "[") {
            // increase depth of turtles
            this.depth++;
            this.turtle = this.turtleStack.addTurtle();
        } else if (string[i] == "]") {
            this.turtle = this.turtleStack.popTurtle();
            this.depth--;
        } else if(string[i] == "b") {
            this.addBranch();
        } else if (string[i] == "f") {
            this.addLeaf();
        } else if (string[i] == "-") {
            this.turtle.rotate(-30, 1, 0, 0);
        } else if (string[i] == "+") {
           this.turtle.rotate(30, 1, 0, 0);
        } else if (string[i] == ">") {
            this.turtle.rotate(30, 0, 1, 0);
        } else if (string[i] == "<") {
            this.turtle.rotate(-30, 0, 1, 0);
        } else if (string[i] == "*") {
            this.turtle.rotate(-30, 0, 0, 1);
        } else if (string[i] == ".") {
            this.turtle.rotate(30, 0, 0, 1);
        } else if (string[i] == "t") {
            this.trunk();
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
