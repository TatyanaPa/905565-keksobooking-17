'use strict';

(function () {
  var Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  var Boundaries = function (top, right, bottom, left) {
    this.top = top || 0;
    this.right = right || 0;
    this.bottom = bottom || 0;
    this.left = left || 0;
  };

  Point.prototype.applyBoundaries = function (boundaries) {
    var boundedPoint = new Point(this.x, this.y);

    if (this.x < boundaries.left) {
      boundedPoint.x = Boundaries.left;
    }

    if (this.x > boundaries.right) {
      boundedPoint.x = boundaries.right;
    }

    if (this.y < boundaries.top) {
      boundedPoint.y = boundaries.top;
    }

    if (this.y > boundaries.bottom) {
      boundedPoint.y = boundaries.bottom;
    }

    return boundedPoint;
  };

  window.utils = {
    Point: Point,
    Boundaries: Boundaries,
    debounce: function (func, delay) {
      var timeout;
      return function () {
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func(args);
        }, delay);
      };
    }
  };
})();
