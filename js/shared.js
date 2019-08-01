'use strict';

(function () {
  var RADIX_DECIMAL = 10;
  var ESCAPE_KEY_CODE = 27;

  window.shared = {
    RADIX_DECIMAL: RADIX_DECIMAL,
    ESCAPE_KEY_CODE: ESCAPE_KEY_CODE,
    checkPropertiesExistance: function (obj) {
      var properties = Array.prototype.splice.call(arguments, 1);

      if (typeof obj !== 'object') {
        return false;
      }

      if (properties.length === 0) {
        return false;
      }

      for (var i = 0, j = properties.length; i < j; i++) {
        if (properties[i] === undefined) {
          return false;
        }
      }

      return true;
    }
  };
})();
