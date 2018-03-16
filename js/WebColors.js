/**
 * A set of web colors that are pleasant to my eyes.
 *
 **/

// +-------------------------------------------------------------------------
// | Let's use beautiful random colors only (seom web colors).
// +-----------------------------------------------------
var WebColors = {
    colors : [
	'rgb(245,67,55)',  // Red
	'rgb(233,29,98)',  // Pink
	'rgb(156,40,177)', // Purple
	'rgb(103,59,183)', // Deep Purple
	'rgb(63,81,181)',  // Indigo
	'rgb(33,150,243)', // Blue
	'rgb(3,169,245)',  // Light Blue
	'rgb(0,187,212)',  // Cyan
	'rgb(0,151,136)',  // Teal
	'rgb(76,176,80)',  // Green
	'rgb(139,194,74)', // Light Green
	'rgb(205,220,57)', // Lime
	'rgb(255,235,60)', // Yellow
	'rgb(254,193,7)'   // Amber 
    ],
    random : function() {
	return WebColors.colors[ Math.floor(Math.random()*WebColors.colors.length) ];
    }
};
