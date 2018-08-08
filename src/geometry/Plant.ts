import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Turtle from '../Turtle';
import Grammar from '../Grammar';
import Cube from './Cube';
import TurtleStack from '../TurtleStack';
import BranchLoader from './BranchLoader';
import Branch from './Branch';

class Plant{

  degree: number;

  leaf: any;
  stem: any;

  center: vec4;
  depth: number = 1;
  // stack for holding the turtles
  turtleStack: TurtleStack;
  turtle: Turtle;
  // expanded string that defines turtle path
  grammar: Grammar;
  // array of branches
  branches: Branch[];
  branchLoader: BranchLoader;


// base length and width of branch based on depth of turtle
  addBranch(scale: number) {
      
    }

    // similar logic to add branch
    addLeaf() {
        /*
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
    */
    }

    
  constructor(center: vec3, stem: any, leaf: any, axiom: string, i: number, degree: number) {
    
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.turtleStack = new TurtleStack();
    this.turtle = this.turtleStack.getTurtle();
    this.stem = stem;
    this.leaf = leaf;
    //this.leafSize = leafSize;
    this.degree = degree;

    // create grammar with input axiom
    this.grammar = new Grammar(axiom, i);
    
    this.branches = new Array<Branch>();
    this.branchLoader = new BranchLoader(this.branches, this.stem, vec4.create());
  }

  // handles turtle operations
 // construct shape from grammar 
 buildShape() {
    let string = this.grammar.getGrammar();
    //string = ["t", "+", "b", "+", "b"];

  //  let forward = vec3.fromValues(0, 1, 0); // initial forward vector
    this.degree = 29;

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

           // let start = this.turtle.position;
            
            //  let axis = vec3.create();
            //  vec3.cross(axis, this.turtle.forward,  forward);
            //  this.turtle.rotate(.005 * this.depth * Math.random(), axis);

            
           // let end = this.turtle.position;
    
            let branch = new Branch(this.turtle.position, this.turtle.orientation, scale);
            this.branches.push(branch);

            this.turtle.move(scale);

        } else if (string[i] == "f") {
            this.addLeaf();
        } else if (string[i] == "-") {
            this.turtle.rotateX(this.degree);
        } else if (string[i] == "+") {
            console.log(this.turtle.direction);
           this.turtle.rotateX(-this.degree);
           console.log(this.turtle.direction);
        } else if (string[i] == ">") {
            this.turtle.rotateY(this.degree);
        } else if (string[i] == "<") {
            this.turtle.rotateY(-this.degree);
        } else if (string[i] == "*") {
            this.turtle.rotateZ(-this.degree);
        } else if (string[i] == ".") {
            this.turtle.rotateZ(this.degree);
        } else if (string[i] == "t") {

            let trunkScale = 1.75;

            let branch = new Branch(this.turtle.position, this.turtle.orientation, trunkScale);
            this.branches.push(branch);

            this.turtle.move(trunkScale);
        }
    }
   this.branchLoader.branches = this.branches;
 }

};

export default Plant;
