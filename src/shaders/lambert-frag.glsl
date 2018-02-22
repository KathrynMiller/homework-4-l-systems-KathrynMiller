#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;
uniform float u_Time;
in vec4 fs_Pos;
uniform sampler2D u_Texture;
in vec2 fs_UV;

vec4 baseCol = vec4(0, 0, 0, 1);
vec4 leafCol = vec4(1, 0, 0, 1);

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.
float fbm(const in vec2 uv);
float noise(in vec2 uv);

void main()
{
    // Material base color (before shading)
        vec4 normal = fs_Nor;
        vec4 diffuseColor;
        if(fs_UV.x == 2.0) {
            diffuseColor = baseCol;
        } else if (fs_UV.x == 3.0) {
            diffuseColor == leafCol;
        } else {
            float height = fbm(vec2(fs_UV.x / 2.0, fs_UV.y * 3.0));
            diffuseColor = vec4(.8, .8, .8, 1) * height;
            height = abs(height);
            if(height > .75) {
                diffuseColor = vec4(0.0, 0, 0, 1);
            } else if (height > .56 ){
                diffuseColor = vec4(1.0);
                normal.y *= noise(vec2(normal.xy));
            } else {
                diffuseColor = vec4(.3, .3, .3, 1);
                diffuseColor = vec4(1.0);
            }
            
        }
        //diffuseColor = texture2D(u_Texture, fs_UV);

        // Calculate the diffuse term for Lambert shading
        float diffuseTerm = dot(normalize(normal), normalize(fs_LightVec));
        // Avoid negative lighting values
        // diffuseTerm = clamp(diffuseTerm, 0, 1);

        float ambientTerm = 0.2;

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.

        // Compute final shaded color
        out_Col = vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a);
}

vec2 smoothF(vec2 uv)
{
    return uv*uv*(3.-2.*uv);
}

float noise(in vec2 uv)
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(1.23456789*v)*v/.987654321);
    l.zw    = smoothF(l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}

float fbm(const in vec2 uv)
{
    float a = 0.6;
    float f = 8.0;
    float n = 0.;
    int it = 8;
    for(int i = 0; i < 320; i++)
    {
        if(i<it)
        {
            n += noise(uv*f)*a;
            a *= .5;
            f *= 2.;
        }
    }
    return n;
}
