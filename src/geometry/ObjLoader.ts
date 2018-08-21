import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class ObjLoader extends Drawable{
    obj: any;
    color: vec3;

    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    colors: Float32Array;
    uvs: Float32Array;

    constructor(obj: any, color: vec3) {
        super();
        this.obj = obj;
        this.color = color;
    }
    
    create() {

        // temporary arrays to push to
        let indices = new Array<number>();
        let vertices = new Array<number>();
        let normals = new Array<number>();
        let colors = new Array<number>();
        let uvs = new Array<number>();

            
            let vertexLength = vertices.length / 4;

            for(let i = 0; i < this.obj.vertices.length; i+=3) {
                
                // get default vertex positions
                let vertex = vec3.fromValues(this.obj.vertices[i], this.obj.vertices[i+ 1], this.obj.vertices[i + 2]);
                vertices.push(vertex[0], vertex[1], vertex[2], 1);
                
                // rotate normals
                let normal = vec3.fromValues(this.obj.vertexNormals[i], this.obj.vertexNormals[i + 1], this.obj.vertexNormals[i + 2]);
                normals.push(normal[0], normal[1], normal[2], 0);

                colors.push(this.color[0], this.color[1], this.color[2], 1);

            }
            for(let i = 0; i < this.obj.textures.length; i+=2) {
                uvs.push(this.obj.textures[i]);
                uvs.push(this.obj.textures[i + 1]);
            }
            for(let i = 0; i < this.obj.indices.length; i++) {
                indices.push(this.obj.indices[i] + vertexLength);
            }

        this.indices = Uint32Array.from(indices);
        this.normals = Float32Array.from(normals);
        this.positions = Float32Array.from(vertices);
        this.colors = Float32Array.from(colors);
        this.uvs = Float32Array.from(uvs);

        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateUVs();
        this.generateCol();

        this.count = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUVs);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        
    }
}

export default ObjLoader;