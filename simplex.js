// Perlin noise implementation
var Simplex = function(x,y,z,normalised) {
	var i, j, k, A = [0, 0, 0];
	var u, v, w, s;
	var onethird = 0.333333333;
	var onesixth = 0.166666667;
	var T = [0x15, 0x38, 0x32, 0x2c, 0x0d, 0x13, 0x07, 0x2a];

	// returns a value in the range of about [-0.347 .. 0.347]
	function noise(x,y,z) {

	}

	function key(a) {
		s = (A[0] + A[1] + A[2]) * onesixth;
		var x = u - A[0] + s;
		var y = v - A[1] + s;
		var z = w - A[2] + s;
		var t = 0.6 - x * x - y * y - z * z;
		var h = shuffle(i + A[0], j + A[1], k + A[2]);
		A[a]++;
		if (t < 0) return 0;
		var b5 = h >> 5 & 1;
		var b4 = h >> 4 & 1;
		var b3 = h >> 3 & 1;
		var b2 = h >> 2 & 1;
		var b = h & 3;
		var p = b == 1 ? x : b == 2 ? y : z;
		var q = b == 1 ? y : b == 2 ? z : x;
		var r = b == 1 ? z : b == 2 ? x : y;
		p = b5 == b3 ? -p : p;
		q = b5 == b4 ? -q: q;
		r = b5 != (b4^b3) ? -r : r;
		t *= t;
		return 8 * t * t * (p + (b == 0 ? q + r : b2 == 0 ? q : r));
	}

	function shuffle(i, j, k) {
		return bee(i, j, k, 0) +
		       bee(j, k, i, 1) +
		       bee(k, i, j, 2) +
		       bee(i, j, k, 3) +
		       bee(j, k, i, 4) +
		       bee(k, i, j, 5) +
		       bee(i, j, k, 6) +
		       bee(j, k, i, 7);
	}

	function bee(i,j,k,B) {
		return T[bee2(i, B) << 2 | bee2(j, B) << 1 | bee2(k, B)];
	}

	function bee2(N,B) {
		return N >> B & 1;
	}

	// Skew input space to relative coordinate in simplex cell
	s = (x + y + z) * onethird;
	i = Math.floor(x+s);
	j = Math.floor(y+s);
	k = Math.floor(z+s);

	// Unskew cell origin back to (x, y , z) space
	s = (i + j + k) * onesixth;
	u = x - i + s;
	v = y - j + s;
	w = z - k + s;;

	A[0] = A[1] = A[2] = 0;

	// For 3D case, the simplex shape is a slightly irregular tetrahedron.
	// Determine which simplex we're in
	var hi = u >= w ? u >= v ? 0 : 1 : v >= w ? 1 : 2;
	var lo = u < w ? u < v ? 0 : 1 : v < w ? 1 : 2;

	var noise=key(hi) + key(3 - hi - lo) + key(lo) + key(0);

	if (normalised)
		return (noise+0.3254920480438685)/(0.3254920480438685+0.3254919598737463);
	else
		return noise;
}