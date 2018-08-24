import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Leaf from './Leaf';

class FallingLoader extends Drawable{
    numLeaves: number;
    minPos: vec3;
    maxPos: vec3;
    leafObj: any;

    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    centers: Float32Array;
    uvs: Float32Array;

    constructor(leafObj: any, minPos: vec3, maxPos: vec3, numLeaves: number) {
        super();
        this.leafObj = leafObj;
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.numLeaves = numLeaves;
    }

    randomPos(): vec3 {
        var final = vec3.create();
        var topThird = this.maxPos[1] - ((this.maxPos[1] - this.minPos[1]) / 3.0); // the minimum height from which to fall
        final = vec3.fromValues(this.minPos[0] + Math.random() * (this.maxPos[0] - this.minPos[0]), 
                                topThird + (Math.random() - 0.2) * (this.maxPos[1] - topThird), 
                                this.minPos[2] + Math.random() * (this.maxPos[2] - this.minPos[2]));
        return final;
    }

    randomRotation(): quat {
        var q = quat.create();
        quat.fromEuler(q, Math.random() * 180.0, Math.random() * 180.0, Math.random() * 180.0);
        return q;
    }

    create() {

        // temporary arrays to push to
        let indices = new Array<number>();
        let vertices = new Array<number>();
        let normals = new Array<number>();
        let centers = new Array<number>();
        let uvs = new Array<number>();

        for(let b = 0; b < this.numLeaves; b++) {
            
            let vertexLength = vertices.length / 4;

            // current translation data
            let totalTrans = mat4.create();
            //var currRot = this.leaves[b].orientation;
            let currRot = this.randomRotation();
            quat.normalize(currRot, currRot);
            let currPos = this.randomPos();
            //var currScale = this.leaves[b].scale;

            // create translation matrix for the current branch by which to transform the vertices
            mat4.fromRotationTranslationScale(totalTrans, currRot, currPos, vec3.fromValues(1, 1, 1));

            for(let i = 0; i < this.leafObj.vertices.length; i+=3) {
                 // get default vertex positions
                 let vertex = vec3.fromValues(this.leafObj.vertices[i], this.leafObj.vertices[i+ 1], this.leafObj.vertices[i + 2]);

                 // calculate centers
             //   if(i==0)
                {
                  let center = vec3.fromValues(currPos[0], currPos[1], currPos[2]);
                  //let center = vec3.fromValues(vertex[0] + currPos[0], vertex[1] + currPos[1], vertex[2] + currPos[2]);
                  centers.push( center[0], center[1], center[2], 1);
                }
               
                vec3.transformMat4(vertex, vertex, totalTrans);
                vertices.push(vertex[0], vertex[1], vertex[2], 1);

                // rotate normals
                let normal = vec3.fromValues(this.leafObj.vertexNormals[i], this.leafObj.vertexNormals[i + 1], this.leafObj.vertexNormals[i + 2]);
                let rotMat = mat4.create();
                mat4.fromQuat(rotMat, currRot);
                vec3.transformMat4(normal, normal, rotMat);
                vec3.normalize(normal, normal);
                normals.push(normal[0], normal[1], normal[2], 0);

            }
            for(let i = 0; i < this.leafObj.textures.length; i+=2) {
                uvs.push(this.leafObj.textures[i]);
                uvs.push(this.leafObj.textures[i + 1]);
            }
            for(let i = 0; i < this.leafObj.indices.length; i++) {
                indices.push(this.leafObj.indices[i] + vertexLength);
            }
        }

        this.indices = Uint32Array.from(indices);
        this.normals = Float32Array.from(normals);
        this.positions = Float32Array.from(vertices);
        this.centers = Float32Array.from(centers);
        this.uvs = Float32Array.from(uvs);

        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateUVs();
        this.generateCenter();

        this.count = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUVs);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCenter);
        gl.bufferData(gl.ARRAY_BUFFER, this.centers, gl.STATIC_DRAW);

        console.log(this.centers.length);
        console.log(this.positions.length);
        
    }
}

export default FallingLoader;