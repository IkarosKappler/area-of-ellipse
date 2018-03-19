/**
 * My very own little ellipse class.
 *
 * @requires Point M
 *
 * @author  Ikaros Kappler
 * @date    2018-03-15
 * @version 1.0.0
 **/


// +-------------------------------------------------------------------
// | Construct a new ellipse.
// +------------------------------------------------
M.Ellipse = function(a,b,center) {

    if( typeof center === 'undefined' ) center = new M.Point();
    
    this.a = a;
    this.b = b;
    this.center = center;
};


// +-------------------------------------------------------------------
// | Compute the area in O(1).
// +--------------------------------------------------
M.Ellipse.prototype.computeArea = function() {
    return Math.PI*this.a*this.b;
};


// +-------------------------------------------------------------------
// | Get the point on the outline by the given circular angle (t).
// |
// | Note that t is NOT the elliptical angle, thus the angle of the vector
// | from the origin the the computed points will be a different one.
// +--------------------------------------------------
M.Ellipse.prototype.getPointAtT = function( t ) {
    return new M.Point( this.a*Math.cos(t), this.b*Math.sin(t) );
};


// +-------------------------------------------------------------------
// | Get the point on the outline by the given angle (theta).
// +--------------------------------------------------
M.Ellipse.prototype.getPointAtTheta = function( theta ) {
    // http://mathworld.wolfram.com/Ellipse-LineIntersection.html
    // Convert this ellipse to a circle
    var circular = new M.Ellipse( Math.max(this.a,this.b), Math.max(this.a, this.b) );
    // Imagine any line defined by the angle theta and find the intersection.
    var linePoint = circular.getPointAtT( theta );
    return this.getCentralLineIntersection( linePoint );
};


// +-------------------------------------------------------------------
// | Get the point (x,y) on the outline by the given diametral line (specified by single point).
// |
// | Not that this point is not unique. There is a second one at (-x,-y).
// +--------------------------------------------------
M.Ellipse.prototype.getCentralLineIntersection = function( point ) {
    // http://mathworld.wolfram.com/Ellipse-LineIntersection.html
    
    var base = (this.a*this.b) / Math.sqrt( this.a*this.a * point.y*point.y + this.b*this.b * point.x*point.x );
    if( point.y < 0 ) {
	console.log( JSON.stringify(point) );
	return new M.Point(  (base * point.x),
			     (base * point.y)
			  );
    } else {
	return new M.Point(  base * point.x,
			     base * point.y
			  );
    }
};


// +-------------------------------------------------------------------
// | Split this ellipse into n elliptic sectors.
// +--------------------------------------------------
M.Ellipse.prototype.sectorize = function( n, startAt ) {

    if( typeof startAt === 'undefined' ) startAt = 0.0;
    
    // This solution was insipred by
    //    https://stackoverflow.com/questions/21277355/how-can-you-find-the-point-on-an-ellipse-that-sweeps-a-given-area
    // Thanks to Vikram and Harish Chandra Rajpoot
    
    var sectors = [];
    var points = [];

    var step  = Math.PI*2/n;
    var circularAngle = startAt+step;
    var theta_old = startAt;
    for( var i = 0; i < n; i++ ) {
	var point = this.getPointAtT( circularAngle );
	points.push( point );
	// Compute the angle for the point (x,y) on the outline.
	// Remember: atan2 begins on top and also returns negative values in [-PI,PI]
	var theta = M.wrapTo2Pi( M.atanYX(point.x,point.y) );
	sectors.push( new M.EllipticSector(this, theta_old, theta) );	
	circularAngle += step;
	theta_old = theta;
    }

    return { points : points, sectors : sectors };
}

/*
M.Ellipse.prototype.scale = function( scaleA, scaleB ) {
    this.a *= scaleA;
    this.b *= scaleB;
    return this;
};
*/


// Self test
if( true ) {

    var e = new M.Ellipse(250,150);
    console.log( JSON.stringify(e) );

}
