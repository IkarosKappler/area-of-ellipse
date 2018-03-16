/**
 * My very own little ellipse class.
 *
 * @requires Point Math.sign (polyfill for IE)
 *
 * @author  Ikaros Kappler
 * @date    2018-03-15
 * @version 1.0.0
 **/


// +-------------------------------------------------------------------
// | Construct a new ellipse.
// +------------------------------------------------
var Ellipse = function(a,b,center) {

    if( typeof center === 'undefined' ) center = new Point();
    
    this.a = a;
    this.b = b;
    this.center = center;
}


// +-------------------------------------------------------------------
// | Compute the area in O(1).
// +--------------------------------------------------
Ellipse.prototype.computeArea = function() {
    return Math.PI*this.a*this.b;
};


// +-------------------------------------------------------------------
// | Get the point on the outline by the given circular angle (t).
// |
// | Note that t is NOT the elliptical angle, thus the angle of the vector
// | from the origin the the computed points will be a different one.
// +--------------------------------------------------
Ellipse.prototype.getPointAtT = function( t ) {
    return new Point( this.a*Math.cos(t), this.b*Math.sin(t) );
};


// +-------------------------------------------------------------------
// | Get the point on the outline by the given angle (theta).
// +--------------------------------------------------
Ellipse.prototype.getPointAtTheta = function( theta ) {
    // http://mathworld.wolfram.com/Ellipse-LineIntersection.html



    // Convert this ellipse to a circle
    var circular = new Ellipse( Math.max(this.a,this.b), Math.max(this.a, this.b) );
    /*
    var ellipticPoint = circular.getPointAtT( theta );
    var linePoint = new Point( ellipticPoint.x * (circular.a/this.a),
			       ellipticPoint.y * (circular.b/this.a)
			     );

    
    var circularIntersection = circular.getCentralLineIntersection( linePoint );
    var circularTheta = M.atanYX( circularIntersection.x, circularIntersection.y );
    return this.getPointAtT( circularTheta );
    */

    // Imagine any line defined by the angle theta and find the intersection.
    var linePoint = circular.getPointAtT( theta );
    return this.getCentralLineIntersection( linePoint );
}


//Ellipse.prototype.getPointAtCircularTheta = function


// +-------------------------------------------------------------------
// | Get the point (x,y) on the outline by the given diametral line (specified by single point).
// |
// | Not that this point is not unique. There is a second one at (-x,-y).
// +--------------------------------------------------
Ellipse.prototype.getCentralLineIntersection = function( point ) {
    // http://mathworld.wolfram.com/Ellipse-LineIntersection.html
    
    var base = (this.a*this.b) / Math.sqrt( this.a*this.a * point.y*point.y + this.b*this.b * point.x*point.x );
    if( point.y < 0 ) {
	console.log( JSON.stringify(point) );
	return new Point(  (base * point.x),
			   (base * point.y)
			);
    } else {
	return new Point(  base * point.x,
			   base * point.y
			);
    }
};


// +-------------------------------------------------------------------
// | Split this ellipse into n elliptic sectors.
// +--------------------------------------------------
Ellipse.prototype.sectorize = function( n, startAt ) {

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
	//var theta = Math.atan2( point.x, point.y );
	//theta = Ellipse.Helpers.atan2To2Pi(theta);
	var theta = M.wrapTo2Pi( M.atanYX(point.x,point.y) );
	
	//console.log( 'theta_raw_deg=' + (theta/Math.PI*180) + ', theta_deg=' + Ellipse.Helpers.wrapTo2Pi(theta)/Math.PI*180 + ', circularAngle=' + (circularAngle/Math.PI*180) );
	//theta = Ellipse.Helpers.wrapTo2Pi(theta);

	sectors.push( new EllipticSector(this, theta_old, theta) );
	
	circularAngle += step;
	theta_old = theta;
    }

    return { points : points, sectors : sectors };
}


Ellipse.prototype.scale = function( scaleA, scaleB ) {
    this.a *= scaleA;
    this.b *= scaleB;
    return this;
};


/*
Ellipse.Helpers = {
    wrapTo2Pi : function(a) {
	a = a % (Math.PI*2);
	if( a < 0 )
	    a = Math.PI*2 + a;
	return a;
    },
    atan2To2Pi : function(a) {
	if( a < 0 ) a = Math.PI-a;
	return a - Math.PI/2.0;
    }
}
*/


// Self test
if( true ) {

    var e = new Ellipse(250,150);
    console.log( JSON.stringify(e) );

}
