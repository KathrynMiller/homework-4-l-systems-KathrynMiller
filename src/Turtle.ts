import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
import { rotateX, rotateY, rotateZ, multiply } from 'gl-mat4';

class Turtle {
    depth: number; // why do we need this?
   // rotation: quat = quat.create(); // represents overall rotation of the direction, used to rotate the obj being drawn
    orientation:vec4 = vec4.fromValues(0.0, 1.0, 0.0, 1.0); // direction turtle is heading, used to move turtle after drawing a branch
    position: vec4 = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

    constructor() {

    }

    rotateXAxis(degree: number) {
        var rotation = mat4.fromValues(1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0,
        this.orientation[0], this.orientation[1], this.orientation[2], this.orientation[3]);
       vec4.transformMat4(this.orientation, this.orientation, rotation);
    }

    rotateYAxis(degree: number) {
        var rotation = mat4.fromValues(1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0,
        this.orientation[0], this.orientation[1], this.orientation[2], this.orientation[3]);
        vec4.transformMat4(this.orientation, this.orientation, rotation);
    }

    rotateZAxis(degree: number) {
        var rotation = mat4.fromValues(1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0,
        this.orientation[0], this.orientation[1], this.orientation[2], this.orientation[3]);
        vec4.transformMat4(this.orientation, this.orientation, rotation);
    }

    move(distance: number) {
        var dir = vec4.multiply(dir, this.orientation, vec4.fromValues(distance, distance, distance, 1.0))
        this.position = vec4.add(this.position, this.position, dir);    
    }

    getPos() : vec4 {
        return this.position;
    }

    getOrientation() : vec4 {
        return this.orientation;
    }

    // returns the radian equivalent of angle in degrees
    toRadians(degree: number) : number{
        return degree * Math.PI / 180.0;
    }
}