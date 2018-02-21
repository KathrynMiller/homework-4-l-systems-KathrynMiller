import Turtle from './Turtle';
import {vec4, mat4, vec3} from 'gl-matrix';

// methods to make adding and popping turtles from the stack cleaner
class TurtleStack {

    stack: Turtle[] = new Array();
    // current turtle being used in the lsystem
    private turtle: Turtle;

    constructor() {
        this.turtle = new Turtle(vec4.fromValues(0, -2, 0, 1), vec4.fromValues(0, 1, 0, 1), mat4.create(), mat4.create(), 1);
    }

    addTurtle(): Turtle {
        let newTurtle = new Turtle(this.turtle.getPos(), this.turtle.getOrientation(), this.turtle.getRotation(), this.turtle.getTotalTrans(), this.turtle.getScale());
        this.stack.push(this.turtle);
        this.turtle = newTurtle;
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