part of glGame;

class Mesh {
	WebGL.Buffer vbo;
	WebGL.Buffer ibo;
	int size;
	
	Mesh() {
		vbo = gl.createBuffer();
		ibo = gl.createBuffer();
		size = 0;
	}
	
	Mesh.fromFile(String path) {
		if (!path.endsWith(".obj")) {
			print("Invalid file format!");
			return;
		}
		
		vbo = gl.createBuffer();
		ibo = gl.createBuffer();
		size = 0;

		HttpRequest.getString(path).then((src) {
			List<Vertex> vertices = new List<Vertex>();
			List<int> indices = new List<int>();
			
			List<String> lines = src.split("\n");
			for (int i = 0; i < lines.length; i++) {
				List<String> tokens = lines[i].split(" ");
				
				if (tokens.length == 0 || tokens[0] == "#")
					continue;
				else if (tokens[0] == "v") {
					vertices.add(new Vertex(new Vector3(double.parse(tokens[1]),
							double.parse(tokens[2]),
							double.parse(tokens[3]))));
				} else if (tokens[0] == "f") {
					indices.add(int.parse(tokens[1]) - 1);
					indices.add(int.parse(tokens[2]) - 1);
					indices.add(int.parse(tokens[3]) - 1);
				}
			}
			
			setVertices(vertices, indices);
		}).catchError((e) => print("An error has occured while loading a mesh from file!"));
	}
	
	void setVertices(List<Vertex> vertices, List<int> indices) {
		size = indices.length; // * Vertex.SIZE
		gl.bindBuffer(WebGL.ARRAY_BUFFER, vbo);
		gl.bufferDataTyped(WebGL.ARRAY_BUFFER, new Float32List.fromList(getVertexData(vertices)), WebGL.STATIC_DRAW);
		
		gl.bindBuffer(WebGL.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferDataTyped(WebGL.ELEMENT_ARRAY_BUFFER, new Int16List.fromList(indices), WebGL.STATIC_DRAW);
	}
	
	void render() {
		gl.enableVertexAttribArray(positionAttribute);
			gl.bindBuffer(WebGL.ARRAY_BUFFER, vbo);
			gl.vertexAttribPointer(positionAttribute, 3, WebGL.FLOAT, false, 0, 0);
			
			gl.bindBuffer(WebGL.ELEMENT_ARRAY_BUFFER, ibo);
			gl.drawElements(WebGL.TRIANGLES, size, WebGL.UNSIGNED_SHORT, 0);
		gl.disableVertexAttribArray(positionAttribute);
	}
}