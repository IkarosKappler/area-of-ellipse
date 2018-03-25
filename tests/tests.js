/**
 * Run tests on the area and angle calculations.
 * 
 * @require M.Elliptse, M.EllipticSector
 *
 * @author Ikaros Kappler
 * @date   2018-03-25
 **/

(function() {

    // +------------------------------------------------------------------------------
    // | Print the result on the test page.
    // |
    // | @param status:String The text status.
    // | @param msg:String The status message (a description of what's happening)
    // | @param optopns:Object { class:String } An optional CSS class list to use.
    // +------------------------------------------------
    function track( status, msg, options ) {
	var row = document.createElement('DIV');
	if( options && options['class'] )
	    row.setAttribute('class','row ' + options['class']);
	else
	    row.setAttribute('class','row' );
	var cellA = document.createElement('DIV');
	cellA.setAttribute('class','inline');
	cellA.innerHTML = status;
	var cellB = document.createElement('DIV');
	cellB.setAttribute('class','inline');
	cellB.innerHTML = msg;
	row.appendChild( cellA );
	row.appendChild( cellB );

	document.getElementById('testresults').appendChild( row );
    }

    // +------------------------------------------------------------------------------
    // | This test code snippet is requied as described in the klugjs docs
    // |   https://bitbucket.org/zserge/klud.js/
    // +-----------------------------------------------
    test(function(e, test, msg) {
	switch (e) {
        case 'begin':
            track( e, 'Test started: ' + test, {'class' : e });
            break;
        case 'end':
            track(e, 'Test finished: ' + test, {'class' : e });
            break;
        case 'pass':
            track(e, 'Assertion passed: ' + test + ':' + msg, {'class' : e });
            break;
        case 'fail':
            track(e, 'Assertion failed: ' + test + ':' + msg, {'class' : e });
            break;
        case 'except':
            track(e, 'Unhandled exception: ' + test + ':' + msg, {'class' : e });
            break;
	}
    });

    
    // +------------------------------------------------------------------------------
    // | Runs all tests.
    // +-----------------------------------------------
    function runAll() {
	var ellipse = new M.Ellipse(250,150);
	test('Test if a full sector equals the full ellipse area', function() {
	    var sector  = new M.EllipticSector(ellipse,0,Math.PI*2);
	    var diff = Math.abs( ellipse.computeArea() - sector.computeArea());
	    ok( diff < 1, 'Difference '+diff+' is smaller 1');
	});
	test('Test if half start sector area equals the second half area', function() {
	    var sectorA  = new M.EllipticSector(ellipse,0,Math.PI);
	    var sectorB  = new M.EllipticSector(ellipse,Math.PI,Math.PI*2);
	    var diff = Math.abs( sectorA.computeArea() - sectorB.computeArea());
	    ok( diff < 1, 'Difference '+diff+' is smaller 1. areaA=' + sectorA.computeArea() + ', areaB=' + sectorB.computeArea() );
	});
	test('Test if half sector area at PI/2 equals half sector area at PI*(3/4)', function() {
	    var sectorA  = new M.EllipticSector(ellipse, Math.PI/2.0, Math.PI*1.5 );
	    var sectorB  = new M.EllipticSector(ellipse, Math.PI*1.5, Math.PI/2);
	    var diff = Math.abs( sectorA.computeArea() - sectorB.computeArea());
	    ok( diff < 1, 'Difference '+diff+' is smaller 1. areaA=' + sectorA.computeArea() + ', areaB=' + sectorB.computeArea() );
	});
	
	
    }

    
    function init() {
	console.log('init');
	window.removeEventListener('load',init);

	document.getElementById('btn-testall').addEventListener('click', runAll);
	
	delete init;
    }
    window.addEventListener('load',init);
    
})();
