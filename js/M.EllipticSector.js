/**
 * An elliptic sector.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2018-03-15
 **/


M.EllipticSector = function( ellipse, theta0, theta1 ) {
    this.ellipse = ellipse;
    this.theta0 = theta0;
    this.theta1 = theta1;
};

M.EllipticSector.prototype.getTheta = function() {
    return this.theta1-this.theta0;
}

M.EllipticSector.prototype.computeArea = function() {
    var theta = this.getTheta();
    var a = this.ellipse.a;
    var b = this.ellipse.b;
    return area =
	((a * b)/2) *
	(theta-Math.atan((b-a)*Math.sin(2*this.theta1) / (a+b+(b-a)*Math.cos(2*this.theta1))) +
	 Math.atan((b-a)*Math.sin(2*this.theta0) / (a+b+(b-a)*Math.cos(2*this.theta0))) );
}


