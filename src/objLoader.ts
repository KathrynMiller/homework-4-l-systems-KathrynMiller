

// class to load obj files
// only need to know vertices and normals for purpose of the lsystem
class objLoader {

    reader: FileReader = new FileReader();
    vertices: number[][] = new Array<Array<number>>();
  //  faces: number[][] = new Array<Array<number>>();
    normals: number[][] = new Array<Array<number>>();
    indices: number[] = new Array();
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
    

}

export default objLoader;