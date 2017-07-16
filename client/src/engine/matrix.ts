import * as Sylvester from 'sylvester';

module Engine {
	export class Matrix {
		static Translation(v: any) {
			if (v.elements.length == 2) {
				var r = Sylvester.Matrix.I(3);
				r.elements[2][0] = v.elements[0];
				r.elements[2][1] = v.elements[1];
				return r;
			}

			if (v.elements.length == 3) {
				var r = Sylvester.Matrix.I(4);
				r.elements[0][3] = v.elements[0];
				r.elements[1][3] = v.elements[1];
				r.elements[2][3] = v.elements[2];
				return r;
			}

			throw "Invalid length for Translation";
		}

		static flatten(l: Sylvester.Matrix): number[] {
			var result = [];
			if (l.elements.length == 0)
				return [];


			for (var j = 0; j < l.elements[0].length; j++)
				for (var i = 0; i < l.elements.length; i++)
					result.push(l.elements[i][j]);
			return result;
		}

		static ensure4x4(m: Sylvester.Matrix) {
			if (m.elements.length == 4 &&
				m.elements[0].length == 4)
				return m;

			if (m.elements.length > 4 ||
				m.elements[0].length > 4)
				return null;

			for (var i = 0; i < m.elements.length; i++) {
				for (var j = m.elements[i].length; j < 4; j++) {
					if (i == j)
						m.elements[i].push(1);
					else
						m.elements[i].push(0);
				}
			}

			for (var i = m.elements.length; i < 4; i++) {
				if (i == 0)
					m.elements.push([1, 0, 0, 0]);
				else if (i == 1)
					m.elements.push([0, 1, 0, 0]);
				else if (i == 2)
					m.elements.push([0, 0, 1, 0]);
				else if (i == 3)
					m.elements.push([0, 0, 0, 1]);
			}

			return m;
		};

		static make3x3(m: Sylvester.Matrix) {
			if (m.elements.length != 4 ||
				m.elements[0].length != 4)
				return null;

			return Sylvester.Matrix.create([[m.elements[0][0], m.elements[0][1], m.elements[0][2]],
			[m.elements[1][0], m.elements[1][1], m.elements[1][2]],
			[m.elements[2][0], m.elements[2][1], m.elements[2][2]]]);
		};
	}


	export class GlUtils {
		static makeLookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
			var eye = Sylvester.$V([ex, ey, ez]);
			var center = Sylvester.$V([cx, cy, cz]);
			var up = Sylvester.$V([ux, uy, uz]);

			var mag;

			var z = eye.subtract(center).toUnitVector();
			var x = up.cross(z).toUnitVector();
			var y = z.cross(x).toUnitVector();

			var m = Sylvester.$M([[x.e(1), x.e(2), x.e(3), 0],
			[y.e(1), y.e(2), y.e(3), 0],
			[z.e(1), z.e(2), z.e(3), 0],
			[0, 0, 0, 1]]);

			var t = Sylvester.$M([[1, 0, 0, -ex],
			[0, 1, 0, -ey],
			[0, 0, 1, -ez],
			[0, 0, 0, 1]]);
			return m.x(t);
		}

		//
		// glOrtho
		//
		static makeOrtho(left, right, bottom, top, znear, zfar) {
			var tx = -(right + left) / (right - left);
			var ty = -(top + bottom) / (top - bottom);
			var tz = -(zfar + znear) / (zfar - znear);

			return Sylvester.$M([[2 / (right - left), 0, 0, tx],
			[0, 2 / (top - bottom), 0, ty],
			[0, 0, -2 / (zfar - znear), tz],
			[0, 0, 0, 1]]);
		}

		//
		// gluPerspective
		//
		static makePerspective(fovy, aspect, znear, zfar) {
			var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
			var ymin = -ymax;
			var xmin = ymin * aspect;
			var xmax = ymax * aspect;

			return GlUtils.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
		}

		//
		// glFrustum
		//
		static makeFrustum(left, right, bottom, top, znear, zfar) {
			var X = 2 * znear / (right - left);
			var Y = 2 * znear / (top - bottom);
			var A = (right + left) / (right - left);
			var B = (top + bottom) / (top - bottom);
			var C = -(zfar + znear) / (zfar - znear);
			var D = -2 * zfar * znear / (zfar - znear);

			return Sylvester.$M([[X, 0, A, 0],
			[0, Y, B, 0],
			[0, 0, C, D],
			[0, 0, -1, 0]]);
		}
	}
}