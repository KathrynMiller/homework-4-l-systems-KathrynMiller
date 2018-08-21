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

vec4 baseCol = vec4(204.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 1);
vec4 leafCol = vec4(233.0 / 255.0, 200.0 / 255.0, 91.0 / 255.0, 1);

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.
float fbm(const in vec2 uv);
float noise(in vec2 uv);

void main()
{
    // Material base color (before shading)
        vec4 normal = fs_Nor;
        vec4 diffuseColor = fs_Col;

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
        out_Col = diffuseColor;
}

