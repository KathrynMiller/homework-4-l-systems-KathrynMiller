

// class to load obj files
// only need to know vertices and normals for purpose of the lsystem
class objLoader {

  reader: FileReader = new FileReader();
  vertices: number[][] = new Array<Array<number>>();
//  faces: number[][] = new Array<Array<number>>();
  normals: number[][] = new Array<Array<number>>();
  indices: number[] = new Array();
  uvs: number[][] = new Array<Array<number>>();
  constructor() {

  }

parse(filePath: string): string {
  let file: string = " ";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", filePath, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {       
              file = rawFile.responseText;
              return file;

          }
      }
  }
  rawFile.send(null);
  return file;
}

load(filePath: string) {
this.indices = new Array();
this.normals =  new Array<Array<number>>();
this.vertices =  new Array<Array<number>>();;
let file : string;
file = this.parse(filePath);
var lines = file.split("\n");
for(let i = 0; i < lines.length; i++) {
  var line = lines[i];
  var chunks = line.split(" ");
  if(chunks[0] == "v") { // vertex data
     this.vertices.push([parseFloat(chunks[1]), parseFloat(chunks[2]), parseFloat(chunks[3]), 1]);   
  } else if (chunks[0] == "vn") { // normal data
      this.normals.push([parseFloat(chunks[1]), parseFloat(chunks[2]), parseFloat(chunks[3]), 0]);  
  } else if (chunks[0] == "vt") {
      this.uvs.push([parseFloat(chunks[1]), parseFloat(chunks[2])]);  
  } else if (chunks[0] == "f") { // face data, use for indexing
    var face = [];
    // split each chunk by / to obtain just the vertex order for indices
    for(let j = 1; j < chunks.length; j++) {
      var data = chunks[j].split("/");
      face.push(data[0]);
    } 
    // triangulate face vertices
    this.indices.push(parseInt(face[0]) - 1);
    this.indices.push(parseInt(face[1]) - 1);
    this.indices.push(parseInt(face[2]) - 1);
    if(face.length > 3) { // account for some triangular faces in obj file that don't need to be triangulated
      this.indices.push(parseInt(face[0]) - 1);
      this.indices.push(parseInt(face[2]) - 1);
      this.indices.push(parseInt(face[3]) - 1);
    }
  }
}

}

getIndices(): number[] {
  return this.indices;
}

getNormals(): number[][] {
  return this.normals;
}

getPositions(): number[][] {
  return this.vertices;
}

getUVs(): number[][] {
  return this.uvs;
}

// texture loading from
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

loadTexture(gl: WebGL2RenderingContext, url: string) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if ((image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1))) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}


}

export default objLoader;