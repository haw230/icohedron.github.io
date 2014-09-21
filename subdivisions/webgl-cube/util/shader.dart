part of glGame;

const String VERTEX_SHADER_SOURCE = """
attribute vec3 position;

uniform mat4 projection;
uniform mat4 modelView;

varying vec4 vColor;

void main() {
	vColor = vec4(clamp(position, 0.0, 1.0), 1.0);
	gl_Position = projection * modelView * vec4(position, 1.0);
}
""";

const String FRAGMENT_SHADER_SOURCE = """
precision mediump float;

varying vec4 vColor;

void main() {
	gl_FragColor = vColor;
}
""";

WebGL.Program program;
int positionAttribute;
WebGL.UniformLocation projectionUniform;
WebGL.UniformLocation modelViewUniform;

void initShaders() {
	WebGL.Shader vertexShader = gl.createShader(WebGL.VERTEX_SHADER);
	gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE);
	gl.compileShader(vertexShader);
	if (gl.getShaderParameter(vertexShader, WebGL.COMPILE_STATUS) == 0) {
		print(gl.getShaderInfoLog(vertexShader));
	}
	
	WebGL.Shader fragmentShader = gl.createShader(WebGL.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
	gl.compileShader(fragmentShader);
	if (gl.getShaderParameter(fragmentShader, WebGL.COMPILE_STATUS) == 0) {
		print(gl.getShaderInfoLog(fragmentShader));
	}
	
	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, WebGL.LINK_STATUS) == 0) {
		print(gl.getProgramInfoLog(program));
	}
	gl.validateProgram(program);
	if (gl.getProgramParameter(program, WebGL.VALIDATE_STATUS) == 0) {
		print(gl.getProgramInfoLog(program));
	}
	gl.useProgram(program);
	
	positionAttribute = gl.getAttribLocation(program, "position");
	projectionUniform = gl.getUniformLocation(program, "projection");
	modelViewUniform = gl.getUniformLocation(program, "modelView");
}
