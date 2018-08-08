import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Branch from './Branch';

class BranchLoader extends Drawable{
    branches: Branch[];
    branchObj: any;
    center: vec4;

    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;

    constructor(branches: Branch[], branchObj: any, center: vec4) {
        super();
        this.branchObj = branchObj;
        this.center = center;
        this.branches = branches;
    }
/*
    getRotation(branch: Branch) {
        let originalEnd = vec3.fromValues(0, 1, 0);
        let finalPos = vec3.fromValues(branch.end[0], branch.end[1], branch.end[2]);
        vec3.normalize(finalPos, finalPos);
        // get axis of rotation from original direction to final
        let axis = vec3.create();
        vec3.cross(axis, originalEnd, finalPos);
        // get angle of rotation
        let dotProduct = vec3.dot(originalEnd, finalPos);
        let angle = Math.acos(dotProduct);
        // create the rotation matrix
        let matrix = mat4.create();
        mat4.fromRotation(matrix, angle, axis);
        return matrix;
    }
*/
    create() {

        // temporary arrays to push to
        let indices = new Array<number>();
        let vertices = new Array<number>();
        let normals = new Array<number>();
        let uvs = new Array<number>();

        for(let b = 0; b < this.branches.length; b++) {
            
            let vertexLength = vertices.length / 4;

            // current translation data
            var totalTrans = mat4.create();
            var currRot = this.branches[b].orientation;
            quat.normalize(currRot, currRot);
            var currPos = this.branches[b].position;
            var currScale = this.branches[b].scale;

            // create translation matrix for the current branch by which to transform the vertices
            mat4.fromRotationTranslationScale(totalTrans, currRot, 
            vec3.fromValues(currPos[0], currPos[1], currPos[2]), vec3.fromValues(currScale, currScale, currScale));

            for(let i = 0; i < this.branchObj.vertices.length; i+=3) {
                
                // get default vertex positions
                let vertex = vec3.fromValues(this.branchObj.vertices[i], this.branchObj.vertices[i+ 1], this.branchObj.vertices[i + 2]);
                vec3.transformMat4(vertex, vertex, totalTrans);
                vertices.push(vertex[0], vertex[1], vertex[2], 1);
                
                // rotate normals
                let normal = vec3.fromValues(this.branchObj.vertexNormals[i], this.branchObj.vertexNormals[i + 1], this.branchObj.vertexNormals[i + 2]);
                let rotMat = mat4.create();
                mat4.fromQuat(rotMat, currRot);
                vec3.transformMat4(normal, normal, rotMat);
                vec3.normalize(normal, normal);
                normals.push(normal[0], normal[1], normal[2], 0);

            }
            for(let i = 0; i < this.branchObj.textures.length; i+=2) {
                uvs.push(this.branchObj.textures[i]);
                uvs.push(this.branchObj.textures[i + 1]);
            }
            for(let i = 0; i < this.branchObj.indices.length; i++) {
                indices.push(this.branchObj.indices[i] + vertexLength);
            }
        }

        this.indices = Uint32Array.from(indices);
        this.normals = Float32Array.from(normals);
        this.positions = Float32Array.from(vertices);
        this.uvs = Float32Array.from(uvs);

        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateUVs();

        this.count = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUVs);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        
    }
}

export default BranchLoader;