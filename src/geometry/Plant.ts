import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Turtle from '../Turtle';
import Grammar from '../Grammar';
import Cube from './Cube';
import TurtleStack from '../TurtleStack';
import BranchLoader from './BranchLoader';
import Branch from './Branch';
import LeafLoader from './LeafLoader';
import Leaf from './Leaf';

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

  leaves: Branch[];
  leafLoader: LeafLoader;
    
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

    this.leaves = new Array<Leaf>();
    this.leafLoader = new LeafLoader(this.leaves, this.leaf, vec4.create());
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
            
            let branch = new Branch(this.turtle.position, this.turtle.orientation, scale);
            this.branches.push(branch);

            this.turtle.move(scale);

        } else if (string[i] == "f") {
           
            let leafScale = 0.2;
            let leaf = new Leaf(this.turtle.position, this.turtle.orientation, scale);
            this.leaves.push(leaf);

           // this.turtle.move(leafScale);
        } else if (string[i] == "-") {
            this.turtle.rotateX(this.degree);
        } else if (string[i] == "+") {
           this.turtle.rotateX(-this.degree);
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
   this.leafLoader.leaves = this.leaves;
 }

};

export default Plant;
