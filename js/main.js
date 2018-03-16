/**
 * This script is capable to:
 *  (i)   Compute the area of an ellipse.
 *  (ii)  Compute the area of an elliptic section based on an angle.
 *  (iii) Compute the area of an elliptic section based on a start and an end angle.
 *  (iv)  Compute a section's angle based on a start angle and a given area.
 *
 *
 * Calculcation based on the elliptical sector computation
 *  See https://rechneronline.de/pi/elliptical-sector.php
 *  and http://keisan.casio.com/exec/system/1343722259
 *
 *
 * Proudly programmed without jQuery.
 *                    
 *
 *
 * @requires M, Ellipse, EllipticSector, WebColors.
 * 
 * @author  Ikaros Kappler a.k.a. Ika Henning Diesenberg
 * @date    2018-03-13
 * @version 1.0.0
 **/



(function() {
    
    // +-------------------------------------------------------------------------
    // | First of all declare some globals.
    // +-----------------------------------------------------
    var canvasSize = { width : 600, height : 600 };
    var center = { x : canvasSize.width/2.0, y : canvasSize.height/2.0 };
    var RAD2DEG = 180/Math.PI;

    // Will be initialized on the 'load' event.
    var canvas = null;
    var ctx = null;
    var inputA = null; 
    var inputB = null; 
    var inputTheta0 = null;
    var inputTheta1 = null; 
    var inputArea = null;
    var radioByArea = null;
    var radioByAngle = null;
    var inputNumSections = null;

    // Define some global getters and setters.
    function getA() { return parseFloat(inputA.value); }
    function getB() { return parseFloat(inputB.value); }
    function getTheta0() { return parseFloat(inputTheta0.value)/180*Math.PI; }
    function getTheta1() { return parseFloat(inputTheta1.value)/180*Math.PI; }
    function setTheta1(angle) { inputTheta1.value = angle/Math.PI*180; }
    function getType() { return getRadioValue('type'); }
    function getArea() { return parseFloat(inputArea.value); }
    function setArea(area) { inputArea.value = area; }
    function getNumSections() { return parseFloat(inputNumSections.value); }
    
    // OK, this function would be more elegant with jQuery.
    function getRadioValue(name) {
	var radios = document.getElementsByTagName('input');
	for (var i=0, len=radios.length; i<len; i++) {
	    if( radios[i].getAttribute('type') != 'radio' || radios[i].getAttribute('name') != name )
		continue;
            if( radios[i].checked ) 
		return radios[i].value;
	}
	return null;
    }

    // +-------------------------------------------------------------------------
    // | Set the info text.
    // +-----------------------------------------------------
    function setInfo(info) {
	document.getElementById('info').innerHTML = info;
    }

    
    // +-------------------------------------------------------------------------
    // | Just start the computation. The function is triggered each time some
    // | input changes.
    // +-----------------------------------------------------
    function compute() {
	// Clear info
	setInfo('');
	
	var ellipse = new Ellipse( getA(), getB() );
	var ellipticSector = new EllipticSector( ellipse, getTheta0(), getTheta1() );
	
	// 'byarea' or 'byangle'
	var type = getType('type'); 

	if( type == 'byangle' ) {
	    //var theta = theta1-theta0;
	    var area = ellipticSector.computeArea(); 
	    setArea(area.toFixed(2));
	    console.log('area=' + area );
	    draw( ellipse.a, ellipse.b, ellipticSector.theta0, ellipticSector.theta1, ellipticSector.getTheta() ); // theta);
	} else if( type == 'byarea' ) {
	    var desiredArea = getArea();
	    // Check if area is out of bounds
	    if( desiredArea < 0 || desiredArea > computeAreaBetween(a,b,0,Math.PI*2) ) {
		setInfo('Your desired area is larger then the whole ellipse.');
		return;
	    }
	    // Stop the recursion after 100 iterations or when the area was approximated close to 10 square pixels.
	    var angle = approximateAngle( ellipse.a, ellipse.b, ellipticSector.theta0, 0, Math.PI*2, desiredArea, 4, 100 ); 
	    setTheta1(angle);
	    draw( ellipse.a, ellipse.b, ellipse.theta0, ellipse.theta0+angle, angle );	    
	} else {
	    console.warn('Unrecognized calculation type: ' + type );
	}
    }

    
    // +-------------------------------------------------------------------------
    // | This is just a straightforward method for computing the elliptic area (a section).
    // |
    // | See http://mathworld.wolfram.com/Ellipse.html
    // |     andhttp://keisan.casio.com/exec/system/1343722259
    // | for the math.
    // +-----------------------------------------------------
    // DEPRECATED
    function computeAreaBetween(a,b,theta0,theta1) {
	var theta = Math.abs(theta1-theta0);
	var area =
	    ((a*b)/2) *
	    (theta-Math.atan((b-a)*Math.sin(2*theta1) / (a+b+(b-a)*Math.cos(2*theta1))) +
	     Math.atan((b-a)*Math.sin(2*theta0) / (a+b+(b-a)*Math.cos(2*theta0))) );
	return area;
    }

    
    // +-------------------------------------------------------------------------
    // | Here comes the magic.
    // |
    // |   Approximate the upper sectional angle 'theta1'.
    // |
    // | @param a:Number The horizontal X-radius.
    // | @param b:Number The vertical   Y-radius.
    // | @param startAngle:Number The lower angle you want to use for the section.
    // | @param lowerAngle:Number Any lower (guessed) section angle to the the next iteration with. Should be smaller than upperAngle.
    // | @param upperAngle:Number Any upper (guessed) section angle to the the next iteration with. Should be larger than lowerAngle.
    // | @param desiredArea:Number The area you want to acquire.
    // | @param eps:Number The desired precision (don't get too small here, it's an area!)
    // | @param maxIterations:Integer A number indicating the maximum number of iterations you want to use. Just for the case your epsilon is too small.
    // |
    // | @return The approximated angle theta1 so that the sectional elliptic area between startAngle and theta1 has the size of the given area.
    // +-----------------------------------------------------
    function approximateAngle(a,b,startAngle,lowerAngle,upperAngle,desiredArea,eps,maxIterations) {

	var lowerArea = computeAreaBetween(a,b,startAngle,lowerAngle);
	var upperArea = computeAreaBetween(a,b,startAngle,upperAngle);

	// Case A: we are already close enough.
	if( maxIterations < 0 || Math.abs(upperArea-lowerArea) <= eps )
	    return (lowerAngle+upperAngle)/2.0;

	// Case B: the lower guessed area is still too large.
	else if( desiredArea < lowerArea )
	    return approximateAngle(a,b,startAngle,lowerAngle/2.0,lowerAngle,desiredArea,eps,maxIterations-1);

	// Case C: the upper guessed area is still too small.
	else if( upperArea < desiredArea )
	    return approximateAngle(a,b,startAngle,upperAngle,upperAngle*2,desiredArea,eps,maxIterations-1)

	// Case D: somewhere in between lower and upper guessed area
	else {
	    // Case D.1: closer to the upper guessed area (increase lower bound)
	    if( lowerArea+(upperArea-lowerArea)/2 < desiredArea )
		return approximateAngle(a,b,startAngle,lowerAngle+(upperAngle-lowerAngle)/2,upperAngle,desiredArea,eps,maxIterations-1);

	    // Case D.2: closer the the lower guessed area (decrease upper bound)
	    else // lowerArea+(upperArea-lowerArea)/2 >= desiredArea )
		return approximateAngle(a,b,startAngle,lowerAngle,lowerAngle+(upperAngle-lowerAngle)/2,desiredArea,eps,maxIterations-1);
	}
    }


    
    // +-------------------------------------------------------------------------
    // | This funcion splits the ellipse into n sectors, all having the same area.
    // +-----------------------------------------------------
    // @DEPRECATED This was my first recursive approximation approach.
    /* function makeEllipticSectors() {
	clearCanvas();
	var a = getA();
	var b = getB();
	var numSections = getNumSections();
	var ellipticArea = computeAreaBetween(a,b,0,Math.PI*2);
	var sectionalArea = ellipticArea/numSections;

	var theta0 = 0;
	var theta1;
	for( var i = 0; i < numSections; i++ ) {
	    theta1 = approximateAngle(a,b,theta0,theta0,Math.PI*2,sectionalArea,4,100);
	    console.log('theta1='+ (theta1/Math.PI*180) );
	    fillEllipticSector(a,b,theta0,theta1,randomColor());
	    theta0 = theta1;
	}

	drawEllipse(a,b);
    }
    */
    function makeEllipticSectors() {
	clearCanvas();
	var numSectors = getNumSections();
	var ellipse = new Ellipse( getA(), getB() );

	var sect = ellipse.sectorize( numSectors, 0 );
	console.log( JSON.stringify(sect.sectors) );
	fillEllipticSectors( ellipse, sect );
	drawEllipticSectors( ellipse, sect );

	drawEllipse( ellipse.a, ellipse.b );
    }


    // +-------------------------------------------------------------------------
    // | Fills the areas of the passed secorization { sectors, points } with
    // | random colors.
    // +-----------------------------------------------------
    function fillEllipticSectors( ellipse, sect ) {
	var sectors = sect.sectors;
	var points  = sect.points;
	
	var circular = new Ellipse( Math.max(ellipse.a,ellipse.b), Math.max(ellipse.a,ellipse.b) );
	var theta_old = 0; 
	for( var i = 0; i < sectors.length; i++ ) {

	    var sector = sectors[i];
	    var p = ellipse.getPointAtTheta( sector.theta1 );
	    
	    // -- Tricky: Javascript's ellipse draw function interpretes the passed angles
	    // -- as elliptic (!) angles, not circular angles. We need to translate our
	    // -- angles into elliptic ones to draw them correctly.
	    // Scale the current point so it's located on the circle	    
	    var p1 = new Point( p.x * (circular.a/ellipse.a), p.y * (circular.b/ellipse.b) );
	    // Compute the new angle
	    var theta1 = M.wrapTo2Pi( M.atanYX( p1.x, p1.y ) );
	    // And locate the new projected point on the ellipse
	    p = ellipse.getPointAtTheta(theta1);

	    fillEllipticSector( ellipse.a, ellipse.b, theta_old, theta1, WebColors.random() );
	    console.log( 'sector['+i+'] theta0=' + sectors[i].theta0*RAD2DEG + ', theta1=' + sectors[i].theta1*RAD2DEG );
	    
	    theta_old = theta1;
	}
    }


    // +-------------------------------------------------------------------------
    // | Draws the outlines of the passed secorization { sectors, points }.
    // +-----------------------------------------------------
    function drawEllipticSectors( ellipse, sect ) {
	var sectors = sect.sectors;
	var points  = sect.points;
	console.log( JSON.stringify(sectors) );
	//var circular = new Ellipse( Math.max(ellipse.a,ellipse.b), Math.max(ellipse.a,ellipse.b) );
	for( var i = 0; i < sectors.length; i++ ) {

	    var sector = sectors[i];
	    var p = ellipse.getPointAtTheta( sector.theta1 );
	    
	    console.log( 'sector['+i+'] theta0=' + sectors[i].theta0*RAD2DEG + ', theta1=' + sectors[i].theta1*RAD2DEG );	    
	    
	    drawLine( center.x, center.y, center.x+points[i].x, center.y+points[i].y, 'black' )
	    ctx.fillStyle = 'black';
	    ctx.fillText(''+i, center.x+points[i].x+5, center.y+points[i].y );
	    
	    drawLine( center.x, center.y, center.x+p.x, center.y+p.y, 'green' );
	    ctx.fillStyle = 'green';
	    ctx.fillText(''+i, center.x+p.x-5, center.y+p.y );
	    //drawLine( center.x, center.y, center.x+points[i].x, center.y+points[i].y, 'black' );

	}
    }

    // +-------------------------------------------------------------------------
    // | Draw a line from (x0,y0) to (x1,y1) with the given color.
    // +-----------------------------------------------------
    function drawLine( x0, y0, x1, y1, color ) {
	ctx.beginPath();
	ctx.moveTo( x0, y0 );
	ctx.lineTo( x1, y1 );
	ctx.closePath();
	ctx.strokeStyle = color;
	ctx.stroke();
    }
    

    // +-------------------------------------------------------------------------
    // | Draw the ellipse with the current input settings onto the HTML5 canvas.
    // +-----------------------------------------------------
    function draw(a,b,theta0,theta1,theta) {

	clearCanvas();	

	var intersections = fillEllipticSector(a,b,theta0,theta1,'#a8c8ff');
	drawEllipse(a,b);

	// Draw theta0
	ctx.strokeStyle = '#800000';
	ctx.beginPath();
	ctx.moveTo( center.x+intersections.x0, center.y-intersections.y0 );
	ctx.lineTo( center.x, center.y );
	ctx.stroke();

	// Draw theta1
	ctx.strokeStyle = '#008000';
	ctx.beginPath();
	ctx.moveTo( center.x, center.y );
	ctx.lineTo( center.x+intersections.x1, center.y-intersections.y1 );
	ctx.stroke();
	
    }

    
    // +-------------------------------------------------------------------------
    // | This function clears the canvas.
    // +-----------------------------------------------------
    function clearCanvas() {
	// Clear canvas
	ctx.fillStyle = '#f0f8ff';
	ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
    }


    // +-------------------------------------------------------------------------
    // | This function draw the ellipse's outline.
    // +-----------------------------------------------------
    function drawEllipse(a,b) {
	// Draw ellipse
	ctx.strokeStyle = '#000000';	
	ctx.beginPath();
	ctx.ellipse( center.x, center.y, a, b, 0, 0, Math.PI*2, false );
	ctx.closePath();
	ctx.stroke();
    }

    // +-------------------------------------------------------------------------
    // | This function fills the specified elliptic sector.
    // +-----------------------------------------------------
    function fillEllipticSector(a,b, theta0, theta1, color ) {
	console.log('[fillEllipticSector] color=' + color );

	// Compute the start and end point of the ellipse sector.
	var x0 = a*Math.cos(theta0);
	var y0 = b*Math.sin(theta0);
	var x1 = a*Math.cos(theta1);
	var y1 = b*Math.sin(theta1);
	    
	// Fill ellipse sector
	ctx.fillStyle = color;	
	ctx.beginPath();
	ctx.moveTo( center.x+x0, center.y-y0 );
	ctx.ellipse( center.x, center.y, a, b, 0, -theta0, -theta1, true );
	ctx.lineTo( center.x, center.y );
	ctx.closePath();
	ctx.fill();

	return { x0 : x0, y0 : y0, x1 : x1, y1 : y1 };
    }
    

    // +-------------------------------------------------------------------------
    // | Initlalize the whole scene.
    // | Get the input elements from the DOM.
    // | Install event listeners.
    // +-----------------------------------------------------
    function init() {	
	// Tidy up the listener queue.
	window.removeEventListener('load',init,false);

	canvas = document.getElementById('canvas');
	ctx    = canvas.getContext('2d');

	inputA = document.getElementById('a');
	inputB = document.getElementById('b');
	inputTheta0 = document.getElementById('theta0');
	inputTheta1 = document.getElementById('theta1');
	inputArea = document.getElementById('area');
	radioByArea = document.getElementById('byarea');
	radioByAngle = document.getElementById('byangle');
	inputNumSections = document.getElementById('num_sections');

	inputA.addEventListener('keyup',compute);
	inputA.addEventListener('change',compute);
	inputA.addEventListener('click',compute);
	inputB.addEventListener('keyup',compute);
	inputB.addEventListener('change',compute);
	inputB.addEventListener('click',compute);
	inputTheta0.addEventListener('keyup',compute);
	inputTheta0.addEventListener('change',compute);
	inputTheta0.addEventListener('click',compute);
	inputTheta1.addEventListener('keyup',compute);
	inputTheta1.addEventListener('change',compute);
	inputTheta1.addEventListener('click',compute);
	inputArea.addEventListener('keyup',compute);
	inputArea.addEventListener('change',compute);
	inputArea.addEventListener('click',compute);
	radioByArea.addEventListener('click',compute);
	radioByAngle.addEventListener('click',compute);

	document.getElementById('mksections').addEventListener('click',makeEllipticSectors);

	compute();

	// Tell the garbage collector we're done with initialization.
	delete init;
    }

    window.addEventListener('load',init);    

})();
