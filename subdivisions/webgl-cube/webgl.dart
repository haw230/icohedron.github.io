library glGame;

import 'dart:html';
import 'dart:web_gl' as WebGL;
import 'dart:async';
import 'dart:typed_data';
import 'dart:math' as Math;
import 'dart:collection';

import 'package:vector_math/vector_math.dart';

part 'util/shader.dart';
part 'util/buffer.dart';
part 'util/input.dart';
part 'util/vertex.dart';
part 'util/mesh.dart';

CanvasElement canvas;
WebGL.RenderingContext gl;

int get width => canvas.width;
int get height => canvas.height;

Mesh mesh;

Matrix4 projectionMatrix;
Matrix4 transformationMatrix;

void main() {
	canvas = querySelector("glCanvas");
	if (canvas == null)
		canvas = querySelector("#glCanvas");
	
	gl = canvas.getContext("webgl");
	if (gl == null)
		gl = canvas.getContext("experimental-webgl");
	
	if (gl == null)
		window.alert("WebGL is not supported in your browser");
	else
		start();
}

void start() {
	init();
	initShaders();
	initInput();
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.viewport(0, 0, width, height);
	
	gl.frontFace(WebGL.CCW);
	gl.cullFace(WebGL.BACK);
	gl.enable(WebGL.CULL_FACE);
	gl.enable(WebGL.DEPTH_TEST);
	
	// TODO: Depth Clamp
	
	run();
}

void init() {
	mesh = new Mesh.fromFile("meshes/cube.obj");
	
	projectionMatrix = makePerspectiveMatrix(radians(70.0), width / height, 0.1, 1000.0);
	transformationMatrix = new Matrix4.identity();
	transformationMatrix.scale(0.2, 0.2, 0.2);
	transformationMatrix.translate(0.0, 0.0, -5.0);
}

int timer = new DateTime.now().millisecondsSinceEpoch;
double lag = 0.0;
final double timestep = 1000 / 60;

void run() {
	int now = new DateTime.now().millisecondsSinceEpoch;
	lag += (now - timer) / timestep;
	timer = now;
	
	while (lag > 1) {
		update();
		lag--;
	}
	
	window.requestAnimationFrame(render);
	
	Timer.run(run);
}

void handleInput() {
	updatePKeys();
}

void update() {
	handleInput();
	
	transformationMatrix.rotateX(0.01);
	transformationMatrix.rotateZ(0.01);
	
	Float32List tempList = new Float32List(16);
	
	projectionMatrix.copyIntoArray(tempList);
	gl.uniformMatrix4fv(projectionUniform, false, tempList);
	
	transformationMatrix.copyIntoArray(tempList);
	gl.uniformMatrix4fv(modelViewUniform, false, tempList);
}

void render(double time) {
	// TODO: Stencil Buffer
	gl.clear(WebGL.COLOR_BUFFER_BIT | WebGL.DEPTH_BUFFER_BIT);
	
	mesh.render();
}
