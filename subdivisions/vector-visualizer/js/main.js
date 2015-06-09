// Global Variables ////
var camera, projection;
var canvas, gl;
var vTextarea, iTextarea;
var tTextarea, sTextarea, rTextarea;
var hasFocus;

// Shaders ////
var shaderProgram;

function getShader(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        console.log("A null element was passed to getShader(" + id + ")");
        return null;
    }
    
    var source = "";
    var c = shaderScript.firstChild;
    while(c) {
        if (c.nodeType == 3) {
            source += c.textContent;
        }
        c = c.nextSibling;
    }
    
    var shader;
    if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
        console.log("Invalid shader type from element " + id);
        return null;
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (shaderScript.type == "x-shader/x-vertex") {
            console.log("Failed to compile vertex shader: " + gl.getShaderInfoLog(shader));
        } else if (shaderScript.type == "x-shader/x-fragment") {
            console.log("Failed to compile fragment shader: " + gl.getShaderInfoLog(shader));
        } else {
            console.log(gl.getShaderInfoLog(shader));
        }
        return null;
    }
    
    return shader;
}

var vertexShader;
var fragmentShader;

function initializeShaders() {
    vertexShader = getShader("shader-vs");
    fragmentShader = getShader("shader-fs");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Failed to link program: " + gl.getProgramInfoLog(shaderProgram));
        return;
    }
    gl.validateProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        console.log("Failed to validate program: " + gl.getProgramInfoLog(shaderProgram));
        return;
    }
    gl.useProgram(shaderProgram);
    
    shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    shaderProgram.mvMatrix = gl.getUniformLocation(shaderProgram, "mvMatrix");
    shaderProgram.pMatrix = gl.getUniformLocation(shaderProgram, "pMatrix");
    shaderProgram.fColor = gl.getUniformLocation(shaderProgram, "fColor");
    shaderProgram.usePositionColor = gl.getUniformLocation(shaderProgram, "usePositionColor");
}

// Transformation Handler ////
var TransformationHandler = function() {
    this.translation = new Vector3();
    this.scale = new Vector3(1.0, 1.0, 1.0);
    this.rotation = new Vector3();
};

TransformationHandler.prototype.getModelViewMatrix = function() {
    return Matrix4.prototype.cameraRotation(camera.forward, camera.up)
    .multiply(Matrix4.prototype.translation(camera.position)
    .multiply(Matrix4.prototype.translation(this.translation)
    .multiply(Matrix4.prototype.rotation(this.rotation)
    .multiply(Matrix4.prototype.scale(this.scale)))));
};

TransformationHandler.prototype.translate = function(v) {
    this.translation = this.translation.add(v);
};

TransformationHandler.prototype.setTranslation = function(v) {
    this.translation = v;
};

TransformationHandler.prototype.rotate = function(v) {
    this.rotation = this.rotation.add(v);
};

TransformationHandler.prototype.setRotation = function(v) {
    this.rotation = v;
};

TransformationHandler.prototype.scale = function(v) {
    this.scale = this.scale.add(v);
};

TransformationHandler.prototype.setScale = function(v) {
    this.scale = v;
};

// Camera ////
var Camera = function(position, forward, up) {
    this.yAxis = new Vector3(0.0, 1.0, 0.0);
    if (up) {
        this.up = up.normalized();
    } else {
        this.up = new Vector3(0.0, 1.0, 0.0);
    }
    if (forward) {
        this.forward = forward.normalized();
    } else {
        this.forward = new Vector3(0.0, 0.0, 1.0);
    }
    if (position) {
        this.position = position;
    } else {
        this.position = new Vector3();
    }
};

Camera.prototype.getLeft = function() {
    return this.forward.cross(this.up).normalized();
};

Camera.prototype.getRight = function() {
    return this.up.cross(this.forward).normalized();
};

Camera.prototype.move = function(v, amt) {
    this.position = this.position.add(v.conjugate().scalar(amt));
};

Camera.prototype.setPosition = function(v) {
    this.position = v.conjugate;
};

Camera.prototype.rotateY = function(angle) {
    var hAxis = this.yAxis.cross(this.forward).normalized();
    this.forward = this.forward.rotate(angle, this.yAxis).normalized();
    this.up = this.forward.cross(hAxis).normalized();
};

Camera.prototype.rotateX = function(angle) {
    var hAxis = this.yAxis.cross(this.forward).normalized();
    this.forward = this.forward.rotate(angle, hAxis).normalized();
    this.up = this.forward.cross(hAxis).normalized();
};

// Input ////
const NUM_KEYS = 223;
const keyCodes  = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    SHIFT: 16
};
var keys = new Array();
var pkeys = new Array();
var mouseDown = false;
var mousePosPrev = new Vector3();

function updateKeys() {
    for (var i = 0; i < NUM_KEYS; i++) {
        pkeys[i] = false;
    }
}

window.onmousedown = function(event) {
    mouseDown = true;
    mousePosPrev = new Vector3(event.clientX, event.clientY, 0.0);
};

window.onmouseup = function(event) {
    mouseDown = false;
};

window.onmousemove = function(event) {
    if (mouseDown) {
        var sensitivity = 0.3;
        camera.rotateY(-(event.clientX - mousePosPrev.x) * sensitivity);
        camera.rotateX(-(event.clientY - mousePosPrev.y) * sensitivity);
        mousePosPrev = new Vector3(event.clientX, event.clientY, 0.0);
    }
};

window.onkeydown = function(event) {
    if (!keys[event.keyCode]) {
        keys[event.keyCode] = true;
        pkeys[event.keyCode] = true;
    }
};

window.onkeyup = function(event) {
    keys[event.keyCode] = false;
};

function keyDown(keyCode) {
    return keys[keyCode];
}

function keyPressed(keyCode) {
    return pkeys[keyCode];
}

// Buffers ////
var Mesh = function(vertices, indices, color) {
    this.vertices = vertices;
    this.indices = indices;
    this.th = new TransformationHandler();
    this.color = color;
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    this.size = indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    var temp = new Array();
    for (var i = 0; i < indices.length; i++) {
        temp[i] = indices[i] - 1;
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(temp), gl.STATIC_DRAW);
};

Mesh.prototype.render = function() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrix, false, this.th.getModelViewMatrix().data);
    if (this.color == "usePositionColor") {
        gl.uniform1i(shaderProgram.usePositionColor, 1);
    } else {
        gl.uniform1i(shaderProgram.usePositionColor, 0);
        gl.uniform4f(shaderProgram.fColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    }
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.drawElements(gl.TRIANGLES, this.size, gl.UNSIGNED_SHORT, 0);
    gl.disableVertexAttribArray(shaderProgram.vertexPosition);
};

var ImportedMesh = function(src, color) {
    var src;
	var vertices = new Array();
	var indices = new Array();
	
	var lines = src.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var tokens = lines[i].split(" ");
		
		if (tokens.length == 0 || tokens[0] == "#")
			continue;
		else if (tokens[0] == "v") {
			vertices.push(parseFloat(tokens[1]));
			vertices.push(parseFloat(tokens[2]));
			vertices.push(parseFloat(tokens[3]));
		} else if (tokens[0] == "f") {
			indices.push(parseInt(tokens[1]) - 1);
			indices.push(parseInt(tokens[2]) - 1);
			indices.push(parseInt(tokens[3]) - 1);
		}
	}
	Mesh.call(this, [vertices, indices, "usePositionColor"]);
};

ImportedMesh.prototype = Object.create(Mesh.prototype);

var Grid = function(start, end, stride, color) {
    this.th = new TransformationHandler();
    this.color = color;
    this.vbo = gl.createBuffer();
    var vertices = new Array();
    for(var x = start; x <= end; x += stride) {
        for(var y = start; y <= end; y += stride) {
            for (var z = start; z <= end; z += stride) {
                vertices.push(start, y, z);
                vertices.push(end, y, z);
                
                vertices.push(x, start, z);
                vertices.push(x, end, z);
                
                vertices.push(x, y, start);
                vertices.push(x, y, end);
            }
        }
    }
    this.size = vertices.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
};

Grid.prototype.render = function() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrix, false, this.th.getModelViewMatrix().data);
    gl.uniform1i(shaderProgram.usePositionColor, 0);
    gl.uniform4f(shaderProgram.fColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, this.size);
    gl.disableVertexAttribArray(shaderProgram.vertexPosition);
};

var GridFloor = function(start, end, stride, yFloor, color) {
    this.th = new TransformationHandler();
    this.color = color;
    this.vbo = gl.createBuffer();
    var vertices = new Array();
    for(var x = start; x <= end; x += stride) {
            for (var z = start; z <= end; z += stride) {
                vertices.push(x, yFloor, start);
                vertices.push(x, yFloor, end);
                
                vertices.push(start, yFloor, z);
                vertices.push(end, yFloor, z);
            }
    }
    this.size = vertices.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
};

GridFloor.prototype = Object.create(Grid.prototype);

// Main Function ////
var mesh;
var grid;
var vText, iText;
var tText, sText, rText;
var firstLoad = true;

function main() {
    canvas = document.getElementById("canvas");
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch(e) {}
    if (!gl) {
        alert("WebGL is not supported in your browser. Please try updating the browser or use another one.");
    }
    
    vTextarea = document.getElementById("vertices");
    iTextarea = document.getElementById("indices");
    
    tTextarea = document.getElementById("translation");
    sTextarea = document.getElementById("scale");
    rTextarea = document.getElementById("rotation");
    
    initializeShaders();
    
    mesh = new Mesh([    0.0, 1.0, 0.0,
                         1.0, -1.0, 0.0,
                        -1.0, -1.0, 0.0,
                         0.0, -1.0, -1.0,
                         0.0, -1.0, 1.0],
                        [1, 3, 4,
                         1, 2, 4,
                         2, 3, 4,
                         1, 3, 5,
                         1, 2, 5,
                         2, 3, 5],
                        "usePositionColor");
    
    grid = new GridFloor(-50.0, 50.0, 2.0, -5.0, [0.0, 0.8, 0.0, 1.0]);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    camera = new Camera(new Vector3(0.0, 0.0, -5.0));
    projection = Matrix4.prototype.perspective(75.0, canvas.width / canvas.height, 0.1, 100.0);
    
    var lastTime = Date.now();
    var delta;
    
    var loop = function() {
        var timeNow = Date.now();
        delta = (timeNow - lastTime) / 1000.0;
        lastTime = timeNow;
        
        update(delta);
        updateKeys();
        render(delta);
        
        window.requestAnimationFrame(loop, canvas);
    }
    
    window.requestAnimationFrame(loop, canvas);
}

var update = function(delta) {
    gl.uniformMatrix4fv(shaderProgram.pMatrix, false, projection.data);
    
    var moveAmt = 5.0 * delta;
    if (keyDown(keyCodes.W)) {
        camera.move(camera.forward, -moveAmt);
    }
    if (keyDown(keyCodes.A)) {
        camera.move(camera.getLeft(), moveAmt);
    }
    if (keyDown(keyCodes.S)) {
        camera.move(camera.forward, moveAmt);
    }
    if (keyDown(keyCodes.D)) {
        camera.move(camera.getRight(), moveAmt);
    }
    if (keyDown(keyCodes.SHIFT)) {
        camera.move(camera.yAxis, -moveAmt);
    }
    if (keyDown(keyCodes.SPACE)) {
        camera.move(camera.yAxis, moveAmt);
    }
        
    if (firstLoad) {
        vText = "";
        for (var i = 0; i < mesh.vertices.length; i++) {
            if ((i + 1) % 3 == 0) {
                vText += mesh.vertices[i].toFixed(1) + "\n";
            } else {
                vText += mesh.vertices[i].toFixed(1) + ", ";
            }
        }
        vTextarea.value = vText.trim();
        iText = "";
        for (var i = 0; i < mesh.indices.length; i++) {
            if ((i + 1) % 3 == 0) {
                iText += mesh.indices[i] + "\n";
            } else {
                iText += mesh.indices[i] + ", ";
            }
        }
        iTextarea.value = iText.trim();
        tText = "(" + mesh.th.translation.x.toFixed(1) + ", " + mesh.th.translation.y.toFixed(1) + ", " + mesh.th.translation.z.toFixed(1) + ")";
        tTextarea.value = tText;
        sText = "(" + mesh.th.scale.x.toFixed(1) + ", " + mesh.th.scale.y.toFixed(1) + ", " + mesh.th.scale.z.toFixed(1) + ")";
        sTextarea.value = sText;
        rText = "(" + mesh.th.rotation.x.toFixed(1) + ", " + mesh.th.rotation.y.toFixed(1) + ", " + mesh.th.rotation.z.toFixed(1) + ")";
        rTextarea.value = rText;
    }
    
    if (!firstLoad) {
        if (vTextarea.value != vText) {
            var newText = vTextarea.value.replace(/(\r\n|\n|\r)/gm, ",").replace(" ", "").split(",");
            var vertices = new Array();
            for (var i = 0; i < newText.length; i++) {
                vertices.push(parseFloat(newText[i]));
            }
            var indices = mesh.indices;
            var th = mesh.th;
            mesh = new Mesh(vertices, indices, "usePositionColor");
            mesh.th = th;
            vText = vTextarea.value;
        }
        if (iTextarea.value != iText) {
            var newText = iTextarea.value.replace(/(\r\n|\n|\r)/gm, ",").replace(" ", "").split(",");
            var vertices = mesh.vertices;
            var indices = new Array();
            for (var i = 0; i < newText.length; i++) {
                indices.push(parseInt(newText[i]));
            }
            var th = mesh.th;
            mesh = new Mesh(vertices, indices, "usePositionColor");
            mesh.th = th;
            iText = vTextarea.value;
        }
        if (tTextarea.value != tText) {
            var newText = tTextarea.value.replace(" ", "").replace("(", "").replace(")", "").split(",");
            mesh.th.setTranslation(new Vector3(parseFloat(newText[0]), parseFloat(newText[1]), parseFloat(newText[2])));
            tText = tTextarea.value;
        }
        if (sTextarea.value != sText) {
            var newText = sTextarea.value.replace(" ", "").replace("(", "").replace(")", "").split(",");
            mesh.th.setScale(new Vector3(parseFloat(newText[0]), parseFloat(newText[1]), parseFloat(newText[2])));
            sText = sTextarea.value;
        }
        if (rTextarea.value != rText) {
            var newText = rTextarea.value.replace(" ", "").replace("(", "").replace(")", "").split(",");
            mesh.th.setRotation(new Vector3(parseFloat(newText[0]), parseFloat(newText[1]), parseFloat(newText[2])));
            rText = rTextarea.value;
        }
    }
    
    if (firstLoad) {
        firstLoad = false;
    }
}

var render = function(delta) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mesh.render();
    grid.render();
};

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    projection = Matrix4.prototype.perspective(75.0, canvas.width / canvas.height, 0.1, 100.0);
};

document.addEventListener("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    for (var i = 0, file; file = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = function(src) {
        	var vertices = new Array();
        	var indices = new Array();
        	
        	var lines = src.target.result.trim().split("\n");
        	for (var i = 0; i < lines.length; i++) {
        		var tokens = lines[i].split(" ");
        		
        		if (tokens.length == 0 || tokens[0] == "#") {
        			continue;
        		} else if (tokens[0] == "v") {
        			vertices.push(parseFloat(tokens[1]));
        			vertices.push(parseFloat(tokens[2]));
        			vertices.push(parseFloat(tokens[3]));
        		} else if (tokens[0] == "f") {
        			indices.push(parseInt(tokens[1]));
        			indices.push(parseInt(tokens[2]));
        			indices.push(parseInt(tokens[3]));
        		}
        	}
        	
	        vText = "";
            for (var i = 0; i < vertices.length; i++) {
                if ((i + 1) % 3 == 0) {
                    vText += vertices[i].toFixed(1) + "\n";
                } else {
                    vText += vertices[i].toFixed(1) + ", ";
                }
            }
            vTextarea.value = vText.trim();
            iText = "";
            for (var i = 0; i < indices.length; i++) {
                if ((i + 1) % 3 == 0) {
                    iText += indices[i] + "\n";
                } else {
                    iText += indices[i] + ", ";
                }
            }
            iTextarea.value = iText.trim();
            
            mesh = new Mesh(vertices, indices, "usePosition");
        };
        reader.readAsText(file);
    }
});