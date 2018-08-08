import {vec4, mat4, vec3, quat} from 'gl-matrix';

class Branch {

    position: vec4 = vec4.create();
    scale: number;
    orientation: quat;

    constructor(pos: vec4, rot: quat, scale: number) {
        vec4.copy(this.position, pos);
        this.scale = scale;
        this.orientation = quat.clone(rot);
    }
}
export default Branch;