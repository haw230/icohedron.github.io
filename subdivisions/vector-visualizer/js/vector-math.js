// Quaternion ////
/* Quaternion Documentation:
    Quaternion takes in 4 arguments corresponding to their respective x, y, z, and w coordinates
    Quaternion.length returns the length of the quaternion
    Quaternion.normalized returns the normalized quaternion
    Quaternion.conjugate returns the quaternion conjugate
    Quaternion.multiply returns the multiplication output of the quaternion and the quaternion passed as an argument
    Quaternion.setTo changes the x, y, z, and w values to those passed in the arguments
*/
var Quaternion = function(x, y, z, w) {
    if (x) {
        this.x = x;
    } else {
        this.x = 0.0;
    }
    if (y) {
        this.y = y;
    } else {
        this.y = 0.0;
    }
    if (z) {
        this.z = z;
    } else {
        this.z = 0.0;
    }
    if (w) {
        this.w = w;
    } else {
        this.w = 0.0;
    }
};

Quaternion.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

Quaternion.prototype.normalized = function() {
    var length = this.length();
    return new Vector3(this.x / length, this.y / length, this.z / length, this.w / length);
};

Quaternion.prototype.conjugate = function() {
    return new Quaternion(-this.x, -this.y, -this.z, this.w);
};

Quaternion.prototype.multiply = function(q) {
    var _w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    var _x = this.x * q.w + this.w * q.x + this.y * q.z - this.z * q.y;
    var _y = this.y * q.w + this.w * q.y + this.z * q.x - this.x * q.z;
    var _z = this.z * q.w + this.w * q.z + this.x * q.y - this.y * q.z;
    
    return new Quaternion(_x, _y, _z, _w);
};

Quaternion.prototype.setTo = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
};

// Vector3 ////
/* Vector3 Documentation:
    Vector3 takes in 3 arguments corresponding to their x, y, and z coordinates
    Vector3.add returns the result of addition between two vectors
    Vector3.subtract returns the result of subtraction between two vectors
    Vector3.multiply returns the result of multiplication between two vectors
    Vector3.scalar returns the result of multiplying the vector by a scalar
    Vector3.division returns the result of division between two vectors
    Vector3.normalized returns the normalized vector
    Vector3.dot returns the dot product between two vectors
    Vector3.cross returns the cross product between two vectors
    Vector3.rotate returns a vector rotated around an specified axis at a specified angle (counter-clockwise)
    Vector3.setTo sets the x, y, and z values to those passed in the arguments
    Vector3.conjugate returns the conjugate of the vector
    */
var Vector3 = function(x, y, z) {
    if (x) {
        this.x = x;
    } else {
        this.x = 0.0;
    }
    if (y) {
        this.y = y;
    } else {
        this.y = 0.0;
    }
    if (z) {
        this.z = z;
    } else {
        this.z = 0.0;
    }
};

Vector3.prototype.add = function(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
};

Vector3.prototype.subtract = function(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
};

Vector3.prototype.multiply = function(v) {
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
};

Vector3.prototype.scalar = function(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
}

Vector3.prototype.divide = function(v) {
    return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
};

Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector3.prototype.normalized = function() {
    var length = this.length();
    return new Vector3(this.x / length, this.y / length, this.z / length);
};

Vector3.prototype.dot = function(v) {
    return this.x * v.x + this.y + v.y + this.z * v.z;
};

Vector3.prototype.cross = function(v) {
    var _x = this.y * v.z - this.z * v.y;
    var _y = this.z * v.x - this.x * v.z;
    var _z = this.x * v.y - this.y * v.x;
    return new Vector3(_x, _y, _z);
};

Vector3.prototype.rotate = function(angle, axis) {
		var sha = Math.sin(((angle / 2) / 180) * Math.PI);
		var cha = Math.cos(((angle / 2) / 180) * Math.PI);
		
		var _x = axis.x * sha;
		var _y = axis.y * sha;
		var _z = axis.z * sha;
		var _w = cha;
		
		var rotation = new Quaternion(_x, _y, _z, _w);
		var conjugate = rotation.conjugate();
		
		var w = rotation.multiply(new Quaternion(this.x, this.y, this.z, 0.0)).multiply(conjugate);
		
		return new Vector3(w.x, w.y, w.z);
};

Vector3.prototype.setTo = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

Vector3.prototype.conjugate = function() {
    return new Vector3(-this.x, -this.y, -this.z);
};

// Matrix4 ////
// Column-major 4x4 Matrix
/* Matrix4 Documentation:
    Matrix4 accepts an array of 16 numerical values to form a 4 x 4 matrix
    Matrix4.identity returns an identity matrix
    Matrix4.multiply returns the result of multiplication between two matrices
    Matrix4.translation returns a translation matrix in column-major order
    Matrix4.rotation returns a rotation matrix for x, y, and z axis in column-major order
    Matrix4.scale returns a scaling matrix in column-major order
    Matrix4.perspective returns a perspective projection matrix in column-major order
    Matrix4.cameraRotation returns a matrix that stores a camera's forward and upward vectors
*/
var Matrix4 = function(data) {
    if (data) {
        this.data = data;
    } else {
        this.data = new Array();
        for (var i = 0; i < 16; i++) {
            this.data[i] = 0.0;
        }
    }
};

Matrix4.prototype.identity = function() {
    var result = new Matrix4();
    result.data[0 + 0 * 4] = 1.0;
    result.data[1 + 1 * 4] = 1.0;
    result.data[2 + 2 * 4] = 1.0;
    result.data[3 + 3 * 4] = 1.0;
    return result;
};

Matrix4.prototype.multiply = function(m) {
    var result = new Matrix4();
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            var sum = 0;
            for (var i = 0; i < 4; i++) {
                sum += this.data[x + i * 4] * m.data[i + y * 4];
            }
            result.data[x + y * 4] = sum;
        }
    }
    return result;
};

Matrix4.prototype.translation = function(v) {
    var result = Matrix4.prototype.identity();
    result.data[0 + 3 * 4] = v.x;
    result.data[1 + 3 * 4] = v.y;
    result.data[2 + 3 * 4] = v.z;
    return result;
};

Matrix4.prototype.rotation = function(v) {
    var result = Matrix4.prototype.identity();
    if (v.x) {
        var radians = v.x * (Math.PI / 180);
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var matrix = Matrix4.prototype.identity();
        matrix.data[1 + 1 * 4] = cos;
        matrix.data[1 + 2 * 4] = -sin;
        matrix.data[2 + 2 * 4] = cos;
        matrix.data[2 + 1 * 4] = sin;
        result = result.multiply(matrix);
    }
    if (v.y) {
        var radians = v.y * (Math.PI / 180);
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var matrix = Matrix4.prototype.identity();
        matrix.data[0 + 0 * 4] = cos;
        matrix.data[0 + 2 * 4] = sin;
        matrix.data[2 + 2 * 4] = cos;
        matrix.data[2 + 0 * 4] = -sin;
        result = result.multiply(matrix);
    }
    if (v.z) {
        var radians = v.z * (Math.PI / 180);
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var matrix = Matrix4.prototype.identity();
        matrix.data[0 + 0 * 4] = cos;
        matrix.data[0 + 1 * 4] = -sin;
        matrix.data[1 + 0 * 4] = sin;
        matrix.data[1 + 1 * 4] = cos;
        result = result.multiply(matrix);
    }
    return result;
};

Matrix4.prototype.scale = function(v) {
    var result = Matrix4.prototype.identity();
    result.data[0 + 0 * 4] = v.x;
    result.data[1 + 1 * 4] = v.y;
    result.data[2 + 2 * 4] = v.z;
    return result;
};

Matrix4.prototype.perspective = function(fov, ar, near, far) {
    var thf = Math.tan(((fov / 2) / 180) * Math.PI);
    var result = new Matrix4();
    result.data[0 + 0 * 4] = 1 / (thf * ar);
    result.data[1 + 1 * 4] = 1 / thf;
    result.data[2 + 2 * 4] = -(far + near) / (far - near);
    result.data[2 + 3 * 4] = -2 * far * near / (far - near);
    result.data[3 + 2 * 4] = -1;
    return result;
};

Matrix4.prototype.cameraRotation = function(forward, up) {
    var result = Matrix4.prototype.identity();
	var f = forward.normalized();
	var r = up.normalized();
	r = r.cross(f);
	var u = f.cross(r);
	
	result.data[0 + 0 * 4] = r.x;
	result.data[1 + 0 * 4] = u.x;
	result.data[2 + 0 * 4] = f.x;
	
	result.data[0 + 1 * 4] = r.y;
	result.data[1 + 1 * 4] = u.y;
	result.data[2 + 1 * 4] = f.y;
	
	result.data[0 + 2 * 4] = r.z;
	result.data[1 + 2 * 4] = u.z;
	result.data[2 + 2 * 4] = f.z;
	
	return result;
}