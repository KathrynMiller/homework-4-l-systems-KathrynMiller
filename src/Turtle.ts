import {vec4, mat3, mat4} from 'gl-matrix';
import { rotateX, rotateY, rotateZ, multiply } from 'gl-mat4';

class Turtle {

    private orientation:vec4 = vec4.create(); // direction turtle is heading, used to move turtle after drawing a branch
    private position: vec4 = vec4.create();
    private totalRotation: mat4 = mat4.create(); // keep track of total rotation of turtle for transforming plant attributes

    constructor(p: vec4, o: vec4, r: mat4) {
        vec4.copy(this.position, p);
        vec4.copy(this.orientation, o);
        mat4.copy(this.totalRotation, r);
    }

    rotateX(degree: number) {
        let r = Math.random();
        // add variation to branches by altering within 10 degree range
        r *= 10.0;
        r -= 5.0;
        degree += r;
        let rotation = mat4.create();
        // create rotation matrix from identity
        rotation = mat4.rotateX(rotation, mat4.create(), this.toRadians(degree));
        // add this rotation to total rotation of turtle
        mat4.rotateX(this.totalRotation, this.totalRotation, this.toRadians(degree));
        // extract orientation values from matrix and normalize the direction
        this.orientation = vec4.normalize(this.orientation, vec4.transformMat4(this.orientation, this.orientation, rotation));
    }

    rotateY(degree: number) {
        let r = Math.random();
        // add variation to branches by altering within 10 degree range
        r *= 10.0;
        r -= 5.0;
        degree += r;
        let rotation = mat4.create();
        // create rotation matrix from identity
        rotation = mat4.rotateY(rotation, mat4.create(), this.toRadians(degree));
        // add this rotation to total rotation of turtle
        mat4.rotateY(this.totalRotation, this.totalRotation, this.toRadians(degree));
        // extract orientation values from matrix and normalize the direction
        this.orientation = vec4.normalize(this.orientation, vec4.transformMat4(this.orientation, this.orientation, rotation));
    }

    rotateZ(degree: number) {
        let r = Math.random();
        // add variation to branches by altering within 10 degree range
        r *= 10.0;
        r -= 5.0;
        degree += r;
        let rotation = mat4.create();
        // create rotation matrix from identity
        rotation = mat4.rotateZ(rotation, mat4.create(), this.toRadians(degree));
        // add this rotation to total rotation of turtle
        mat4.rotateZ(this.totalRotation, this.totalRotation, this.toRadians(degree));
        // extract orientation values from matrix and normalize the direction
        this.orientation = vec4.normalize(this.orientation, vec4.transformMat4(this.orientation, this.orientation, rotation));
    }

    move(distance: number) {
        let dir = vec4.create();
        dir = vec4.multiply(dir, this.orientation, vec4.fromValues(distance, distance, distance, 1.0))
        this.position = vec4.add(this.position, this.position, dir); 
        this.position[3] = 1;   
    }

    getPos() : vec4 {
        return this.position;
    }

    getOrientation() : vec4 {
        return this.orientation;
    }

    getRotation() : mat4 {
        return this.totalRotation;
    }
    // returns the radian equivalent of angle in degrees
    toRadians(degree: number) : number{
        return degree * Math.PI / 180.0;
    }
}

export default Turtle;