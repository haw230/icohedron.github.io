part of glGame;

List<double> getVertexData(List<Vertex> vertices) {
	List<double> data = new List<double>();
	for (int i = 0; i < vertices.length; i++) {
		data.add(vertices[i].pos.x);
		data.add(vertices[i].pos.y);
		data.add(vertices[i].pos.z);
	}
	return data;
}