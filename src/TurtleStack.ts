import Turtle from './Turtle';
import {vec4, mat4} from 'gl-matrix';

// methods to make adding and popping turtles from the stack cleaner
class TurtleStack {

    stack: Turtle[] = new Array();
    // current turtle being used in the lsystem
    private turtle: Turtle;

    constructor() {
        this.turtle = new Turtle(vec4.fromValues(0, -2, 0, 1), vec4.fromValues(0, 1, 0, 1), mat4.create());
    }

    addTurtle(): Turtle {
        let newTurtle = new Turtle(this.turtle.getPos(), this.turtle.getOrientation(), this.turtle.getRotation());
        this.stack.push(this.turtle);
        return newTurtle;
    }

    popTurtle(): Turtle {
        this.turtle = this.stack.pop();
        return this.turtle;
    }

    getTurtle(): Turtle {
        return this.turtle;
    }
}

export default TurtleStack;