import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import { rotateX, rotateY, rotateZ, multiply} from 'gl-mat4';

class Turtle {

    private scale: number = 1;
    private orientation:vec4 = vec4.create(); // direction turtle is heading, used to move turtle after drawing a branch
    private position: vec4 = vec4.create();
    private totalRotation: mat4 = mat4.create(); // keep track of total rotation of turtle for transforming plant attributes
    private totalTrans: mat4 = mat4.create();

    constructor(p: vec4, o: vec4, r: mat4, t: mat4, s: number) {
        vec4.copy(this.position, p);
        this.scale = s;
        vec4.copy(this.orientation, o);
        mat4.copy(this.totalRotation, r);
        mat4.copy(this.totalTrans, t);
    }

    rotate(degree: number, x: number, y: number, z: number) {
        let r = Math.random();
        // add variation to branches by altering within 10 degree range
        r *= 10.0;
        r -= 5.0;
        degree += r;
        let rotation = mat4.create();
        // create rotation matrix from identity
        rotation = mat4.rotate(rotation, mat4.create(), this.toRadians(degree), vec3.fromValues(x, y, z));
        // add this rotation to total rotation of turtle
        mat4.rotate(this.totalRotation, this.totalRotation, this.toRadians(degree), vec3.fromValues(x, y, z));
        mat4.rotate(this.totalTrans, this.totalTrans, this.toRadians(degree), vec3.fromValues(x, y, z));
        // extract orientation values from matrix and normalize the direction
        this.orientation = vec4.normalize(this.orientation, vec4.transformMat4(this.orientation, this.orientation, rotation));
    }

    move(d: number) {
        let dir = vec4.create();
        dir = vec4.multiply(dir, this.orientation, vec4.fromValues(d, d, d, 1.0));
        let newPos = vec4.create();
        let diff = vec4.create();
        vec4.add(newPos, this.position, dir); 
        diff = vec4.subtract(diff, newPos, this.position);
        // translate totalTrans by change in position 
        mat4.translate(this.totalTrans, this.totalTrans, vec3.fromValues(diff[0], diff[1], diff[2]));
        this.position = newPos;
        this.position[3] = 1; 
    }

    getPos() : vec4 {
        return this.position;
    }

    getOrientation() : vec4 {
        return this.orientation;
    }

    getScale() : number {
        return this.scale;
    }

    setScale(s: number) {
        this.scale = s;
    }

    getRotation() : mat4 {
        return this.totalRotation;
    }

    // calculate trans as TRS rather than creating a long string of matrices as we go
    getTotalTrans() : mat4 {
        let trans: mat4 = mat4.create();
        mat4.translate(trans, trans, vec3.fromValues(this.position[0], this.position[1], this.position[2]));
        mat4.multiply(trans, trans, this.totalRotation);
       //mat4.scale(trans, trans, vec3.fromValues(this.scale, this.scale, this.scale));
        return trans;
    }
    // returns the radian equivalent of angle in degrees
    toRadians(degree: number) : number{
        return degree * Math.PI / 180.0;
    }
}

export default Turtle;