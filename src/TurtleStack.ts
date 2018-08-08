import Turtle from './Turtle';
import {vec4, mat4, vec3, quat} from 'gl-matrix';

// methods to make adding and popping turtles from the stack cleaner
class TurtleStack {

    stack: Turtle[] = new Array();
    // current turtle being used in the lsystem
    private turtle: Turtle;

    constructor() {
        this.turtle = new Turtle(vec4.fromValues(0, 0, 0, 1), quat.create()); // pos, forward, right, up
    }

    addTurtle(): Turtle {
        let newTurtle = this.turtle.copyTurtle();
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