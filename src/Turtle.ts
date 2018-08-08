import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
//import { rotateX, rotateY, rotateZ, multiply} from 'gl-mat4';
//import { getRotation } from 'gl-matrix/src/gl-matrix/mat4';

const PI = Math.PI;
const deg2rad = PI / 180.0;

class Turtle {
    static q = quat.create();

    public scale: number = 1;
    public orientation: quat = quat.create();
    public direction: vec4 = vec4.create();
    public position: vec4 = vec4.create();

    constructor(p: vec4, o: quat) {
        vec4.copy(this.position, p);
        quat.copy(this.orientation, o);
        this.direction = vec4.fromValues(0.0, 1.0, 0.0, 0.0);
    }

    copyTurtle(): Turtle {
        return new Turtle(this.position, this.orientation);
    }

    applyRotation()
    {
        this.direction = vec4.transformQuat(this.direction, this.direction, this.orientation);
    }

    rotateX(degree: number) {
        quat.setAxisAngle(Turtle.q, vec3.fromValues(1.0, 0.0, 0.0), this.toRadians(degree));
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q);
        this.applyRotation();
    }

    rotateY(degree: number) {
        quat.setAxisAngle(Turtle.q, vec3.fromValues(0.0, 1.0, 0.0), this.toRadians(degree));
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q);
        this.applyRotation();
     }

     rotateZ(degree: number) {
        quat.setAxisAngle(Turtle.q, vec3.fromValues(0.0, 0.0, 1.0), this.toRadians(degree));
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q);
        this.applyRotation();
     }

    move(d: number) {
        this.position = vec4.fromValues(this.position[0] + d * this.direction[0], this.position[1] + d * this.direction[1], this.position[2] + d * this.direction[2], 1)
    }

    getPos() : vec4 {
        return this.position;
    }

    // getRotationMatrix() : mat4 {
    //     return mat4.fromValues(this.forward[0], this.forward[1], this.forward[2], 0, 
    //         this.right[0], this.right[1], this.right[2], 0, 
    //         this.up[0], this.up[1],this.up[2],0,
    //         0,0,0,1);
    // }

    // returns the radian equivalent of angle in degrees
    toRadians(degree: number) : number{
        return degree * Math.PI / 180.0;
    }

    printMat4(mat: mat4) {
        console.log(mat[0] + " " + mat[4] + " " + mat[8] + " " + mat[12]);
        console.log(mat[1] + " " + mat[5] + " " + mat[9] + " " + mat[13]);
        console.log(mat[2] + " " + mat[6] + " " + mat[10] + " " + mat[14]);
        console.log(mat[3] + " " + mat[7] + " " + mat[11] + " " + mat[15]);
    }
}

export default Turtle;
