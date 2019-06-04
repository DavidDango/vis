/** ============================================================================
 * Location of all the endpoint drawing routines.
 *
 * Every endpoint has its own drawing routine, which contains an endpoint definition.
 *
 * The endpoint definitions must have the following properies:
 *
 * - (0,0) is the connection point to the node it attaches to
 * - The endpoints are orientated to the positive x-direction
 * - The length of the endpoint is at most 1
 *
 * As long as the endpoint classes remain simple and not too numerous, they will
 * be contained within this module.
 * All classes here except `EndPoints` should be considered as private to this module.
 *
 * -----------------------------------------------------------------------------
 * ### Further Actions
 *
 * After adding a new endpoint here, you also need to do the following things:
 *
 * - Add the new endpoint name to `network/options.js` in array `endPoints`.
 * - Add the new endpoint name to the documentation.
 *   Scan for 'arrows.to.type` and add it to the description.
 * - Add the endpoint to the examples. At the very least, add it to example
 *   `edgeStyles/arrowTypes`.
 * ============================================================================= */

// NOTE: When a typedef is isolated in a separate comment block, an actual description is generated for it,
//       using the rest of the commenting in the code block. Usage of typedef in other comments then
//       link to there. TIL.
//
//       Also noteworthy, all typedef's set up in this manner are collected in a single, global page 'global.html'.
//       In other words, it doesn't matter *where* the typedef's are defined in the code.
//
//
// TODO: add descriptive commenting to given typedef's

/**
 * @typedef {{type:string, point:Point, angle:number, length:number}} ArrowData
 *
 * Object containing instantiation data for a given endpoint.
 */

/**
 * @typedef {{x:number, y:number}} Point
 * 
 * A point in view-coordinates.
 */

/**
 * Common methods for endpoints
 *
 * @class
 */
class EndPoint {

  /**
   * Apply transformation on points for display.
   *
   * The following is done:
   * - rotate by the specified angle
   * - multiply the (normalized) coordinates by the passed length
   * - offset by the target coordinates
   *
   * @param {Array<Point>} points
   * @param {ArrowData} arrowData
   * @static
   */
  static transform(points, arrowData) {
    if (!(points instanceof Array)) {
      points = [points];
    }

    var x = arrowData.point.x;
    var y = arrowData.point.y;
    var angle = arrowData.angle
    var length = arrowData.length;

    for(var i = 0; i < points.length; ++i) {
      var p  = points[i];
      var xt = p.x * Math.cos(angle) - p.y * Math.sin(angle);
      var yt = p.x * Math.sin(angle) + p.y * Math.cos(angle);

      p.x = x + length*xt;
      p.y = y + length*yt;
    }
  }


  /**
   * Draw a closed path using the given real coordinates.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array.<Point>} points
   * @static
   */
  static drawPath(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(var i = 1; i < points.length; ++i) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  }
}




/**
 * Drawing methods for the arrow endpoint.
 * @extends EndPoint
 */
class Arrow extends EndPoint {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {
    // Normalized points of closed path, in the order that they should be drawn.
    // (0, 0) is the attachment point, and the point around which should be rotated
    var points = [
      { x: 0  , y: 0  },
      { x:-1  , y: 0.3},
      { x:-0.9, y: 0  },
      { x:-1  , y:-0.3},
    ];

    EndPoint.transform(points, arrowData);
    EndPoint.drawPath(ctx, points);
  }
}


/**
 * Drawing methods for the circle endpoint.
 */
class Circle {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {
    var point = {x:-0.4, y:0};

    EndPoint.transform(point, arrowData);
    ctx.circle(point.x, point.y, arrowData.length*0.4);
  }
}


/**
 * Drawing methods for the bar endpoint.
 */
class Bar {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {
/*
    var points = [
      {x:0, y:0.5},
      {x:0, y:-0.5}
    ];

    EndPoint.transform(points, arrowData);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.stroke();
*/

    var points = [
      {x:0, y:0.5},
      {x:0, y:-0.5},
      {x:-0.15, y:-0.5},
      {x:-0.15, y:0.5},
    ];

    EndPoint.transform(points, arrowData);
    EndPoint.drawPath(ctx, points);
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class AlwaysBroad {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0.05, y:-0.4}, {x:-0.25, y:-0.4}], [{x:-0.1, y:-0.55}, {x:-0.1, y:-0.25}], [{x:0, y:-0.5}, {x:-0.2, y:-0.3}], [{x:-0.2, y:-0.5}, {x:0, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.75, y:-0.4}, {x:-1.05, y:-0.4}], [{x:-0.9, y:-0.55}, {x:-0.9, y:-0.25}], [{x:-0.8, y:-0.5}, {x:-1, y:-0.3}], [{x:-1, y:-0.5}, {x:-0.8, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0.05, y:0.4}, {x:-0.25, y:0.4}], [{x:-0.1, y:0.55}, {x:-0.1, y:0.25}], [{x:0, y:0.5}, {x:-0.2, y:0.3}], [{x:-0.2, y:0.5}, {x:0, y:0.3}]];
    }
    else {
      extra = [[{x:-0.75, y:0.4}, {x:-1.05, y:0.4}], [{x:-0.9, y:0.55}, {x:-0.9, y:0.25}], [{x:-0.8, y:0.5}, {x:-1, y:0.3}], [{x:-1, y:0.5}, {x:-0.8, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.filStyle = temp;

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class AlwaysMulti {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]];
    }
    else {
      extra = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.filStyle = temp;

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class AlwaysUni {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    EndPoint.transform(points, arrowData);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.filStyle = temp;
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class NeverBroad {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0.05, y:-0.4}, {x:-0.25, y:-0.4}], [{x:-0.1, y:-0.55}, {x:-0.1, y:-0.25}], [{x:0, y:-0.5}, {x:-0.2, y:-0.3}], [{x:-0.2, y:-0.5}, {x:0, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.75, y:-0.4}, {x:-1.05, y:-0.4}], [{x:-0.9, y:-0.55}, {x:-0.9, y:-0.25}], [{x:-0.8, y:-0.5}, {x:-1, y:-0.3}], [{x:-1, y:-0.5}, {x:-0.8, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0.05, y:0.4}, {x:-0.25, y:0.4}], [{x:-0.1, y:0.55}, {x:-0.1, y:0.25}], [{x:0, y:0.5}, {x:-0.2, y:0.3}], [{x:-0.2, y:0.5}, {x:0, y:0.3}]];
    }
    else {
      extra = [[{x:-0.75, y:0.4}, {x:-1.05, y:0.4}], [{x:-0.9, y:0.55}, {x:-0.9, y:0.25}], [{x:-0.8, y:0.5}, {x:-1, y:0.3}], [{x:-1, y:0.5}, {x:-0.8, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class NeverMulti {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]];
    }
    else {
      extra = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class NeverUni {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    EndPoint.transform(points, arrowData);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class SomeBroad {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    var pointsb = [
      {x:-0.5, y:0.4},
      {x:-0.9, y:0},
      {x:-0.5, y:-0.4}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0.05, y:-0.4}, {x:-0.25, y:-0.4}], [{x:-0.1, y:-0.55}, {x:-0.1, y:-0.25}], [{x:0, y:-0.5}, {x:-0.2, y:-0.3}], [{x:-0.2, y:-0.5}, {x:0, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.75, y:-0.4}, {x:-1.05, y:-0.4}], [{x:-0.9, y:-0.55}, {x:-0.9, y:-0.25}], [{x:-0.8, y:-0.5}, {x:-1, y:-0.3}], [{x:-1, y:-0.5}, {x:-0.8, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0.05, y:0.4}, {x:-0.25, y:0.4}], [{x:-0.1, y:0.55}, {x:-0.1, y:0.25}], [{x:0, y:0.5}, {x:-0.2, y:0.3}], [{x:-0.2, y:0.5}, {x:0, y:0.3}]];
    }
    else {
      extra = [[{x:-0.75, y:0.4}, {x:-1.05, y:0.4}], [{x:-0.9, y:0.55}, {x:-0.9, y:0.25}], [{x:-0.8, y:0.5}, {x:-1, y:0.3}], [{x:-1, y:0.5}, {x:-0.8, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    EndPoint.transform(pointsb, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pointsb[0].x, pointsb[0].y);
    ctx.lineTo(pointsb[1].x, pointsb[1].y);
    ctx.lineTo(pointsb[2].x, pointsb[2].y);
    ctx.closePath();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fill();
    ctx.filStyle = temp;

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class SomeMulti {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    var pointsb = [
      {x:-0.5, y:0.4},
      {x:-0.9, y:0},
      {x:-0.5, y:-0.4}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    var extra;

    if (arrowData.angle > -Math.PI/4 && arrowData.angle < Math.PI/4){
      extra = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]];
    }
    else if (arrowData.angle < 3*Math.PI/4 && arrowData.angle > 0) {
      extra = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]];
    }
    else if (arrowData.angle > -3*Math.PI/4 && arrowData.angle < 0) {
      extra = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]];
    }
    else {
      extra = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]];
    }

    EndPoint.transform(points, arrowData);
    EndPoint.transform(pointsb, arrowData);
    for(var i = 0; i < extra.length; ++i) {
      EndPoint.transform(extra[i], arrowData);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pointsb[0].x, pointsb[0].y);
    ctx.lineTo(pointsb[1].x, pointsb[1].y);
    ctx.lineTo(pointsb[2].x, pointsb[2].y);
    ctx.closePath();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fill();
    ctx.filStyle = temp;

    for(var i = 0; i < extra.length; ++i) {
      ctx.beginPath();
      ctx.moveTo(extra[i][0].x, extra[i][0].y);
      for(var j = 1; j < extra[i].length; ++j) {
        ctx.lineTo(extra[i][j].x, extra[i][j].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

/**
 * Drawing methods for the bar endpoint.
 */
class SomeUni {

  /**
   * Draw this shape at the end of a line.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {

    var points = [
      {x:0, y:0},
      {x:-0.5, y:0.5},
      {x:-1, y:0},
      {x:-0.5, y:-0.5}
    ];

    var pointsb = [
      {x:-0.5, y:0.4},
      {x:-0.9, y:0},
      {x:-0.5, y:-0.4}
    ];

    /*
    var extraq1 = [[{x:0, y:-0.4}, {x:-0.2, y:-0.4}], [{x:-0.1, y:-0.5}, {x:-0.1, y:-0.3}]]
    var extraq2 = [[{x:0, y:0.4}, {x:-0.2, y:0.4}], [{x:-0.1, y:0.5}, {x:-0.1, y:0.3}]]
    var extraq3 = [[{x:-0.8, y:-0.4}, {x:-1, y:-0.4}], [{x:-0.9, y:-0.5}, {x:-0.9, y:-0.3}]]
    var extraq4 = [[{x:-0.8, y:0.4}, {x:-1, y:0.4}], [{x:-0.9, y:0.5}, {x:-0.9, y:0.3}]]

    var temp = [{x:-0.1, y:-0.4}, {x:-0.1, y:0.4}, {x:-0.9, y:-0.4}, {x:-0.9, y:0.4}]

    EndPoint.transform(temp, arrowData);
    */

    EndPoint.transform(points, arrowData);
    EndPoint.transform(pointsb, arrowData);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pointsb[0].x, pointsb[0].y);
    ctx.lineTo(pointsb[1].x, pointsb[1].y);
    ctx.lineTo(pointsb[2].x, pointsb[2].y);
    ctx.closePath();
    let temp = ctx.filStyle;
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fill();
    ctx.filStyle = temp;
  }
}

/**
 * Drawing methods for the endpoints.
 */
class EndPoints {

  /**
   * Draw an endpoint
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {ArrowData} arrowData
   * @static
   */
  static draw(ctx, arrowData) {
    var type;
    if (arrowData.type) {
      type = arrowData.type.toLowerCase();
    }

    switch (type) {
    case 'circle':
      Circle.draw(ctx, arrowData);
      break;
    case 'bar':
      Bar.draw(ctx, arrowData);
      break;
    case 'alwaysmulti':
      AlwaysMulti.draw(ctx, arrowData);
      break;
    case 'alwaysbroad':
      AlwaysBroad.draw(ctx, arrowData);
      break;
    case 'alwaysuni':
      AlwaysUni.draw(ctx, arrowData);
      break;
    case 'nevermulti':
      NeverMulti.draw(ctx, arrowData);
      break;
    case 'neverbroad':
      NeverBroad.draw(ctx, arrowData);
      break;
    case 'neveruni':
      NeverUni.draw(ctx, arrowData);
      break;
    case 'somemulti':
      SomeMulti.draw(ctx, arrowData);
      break;
    case 'somebroad':
      SomeBroad.draw(ctx, arrowData);
      break;
    case 'someuni':
      SomeUni.draw(ctx, arrowData);
      break;
    case 'arrow':  // fall-through
    default:
      Arrow.draw(ctx, arrowData);
    }
  }
}

export default EndPoints;
