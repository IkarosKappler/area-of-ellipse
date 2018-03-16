/**
 * This is a polyfill for the function 
 *   Canvas.ellipse(x,y,radiusX,radiusY,startAngle,endAngle,antiClockwise) 
 * as described in
 *   https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-ellipse
 *
 *
 * This snipped comes from Google's Canvas-Polyfill script, as located here: 
 * https://github.com/google/canvas-5-polyfill/blob/master/canvas.js
 **/


if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
  CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    this.scale(radiusX, radiusY);
    this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    this.restore();
  }
}
