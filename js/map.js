'use strict';

(function () {
  var PIN_WIDTH = 40;
  var MIN_PIN_Y = 130;
  var MAX_PIN_Y = 630;

  var mapElement = document.querySelector('.map');
  var pinsContainerElement = mapElement.querySelector('.map__pins');
  var mainPinElement = pinsContainerElement.querySelector('.map__pin--main');

  var mapWidth = mapElement.clientWidth;
  var mainPinBoundaries = new window.utils.Boundaries(
      MIN_PIN_Y,
      mapWidth - PIN_WIDTH,
      MAX_PIN_Y,
      PIN_WIDTH
  );

  var initialMainPinPosition = {
    left: mainPinElement.style.left,
    top: mainPinElement.style.top
  };

  var _ads = [];
  var isMapEnabled = false;

  window.map = {
    setEnabled: function (enabled) {
      if (enabled) {
        mapElement.classList.remove('map--faded');
      } else {
        _ads = [];
        window.card.hide();
        window.filters.setEnabled(false);
        removePins();
        resetMainPin();
        mapElement.classList.add('map--faded');
      }

      isMapEnabled = enabled;
    },
    updatePins: function () {
      removePins();
      renderPins();
    }
  };

  var loadAds = function () {
    var onSuccess = function (ads) {
      _ads = ads;

      window.filters.setEnabled(true);
      window.map.updatePins();
    };

    var onError = function () {
      window.xhr.showErrorMessage('Ошибка загрузки объявления', loadAds);
    };

    window.xhr.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
  };

  var resetMainPin = function () {
    mainPinElement.style.left = initialMainPinPosition.left;
    mainPinElement.style.top = initialMainPinPosition.top;
    updateMainPinAddress();
  };

  var removePins = function () {
    window.card.hide();

    var pinElements = pinsContainerElement.querySelectorAll('.map__pin');
    pinElements.forEach(function (pinElement) {
      if (pinElement !== mainPinElement) {
        pinsContainerElement.removeChild(pinElement);
      }
    });
  };

  var renderPins = function () {
    var ads = window.filters.apply(_ads);
    var fragment = document.createDocumentFragment();

    ads.forEach(function (ad, index) {
      var pin = window.createMapPinNode(ad);
      pin.dataset.id = index;

      var pinClickHandler = function (evt) {
        var id = evt.currentTarget.dataset.id;
        window.card.show(ads[id]);
      };

      pin.addEventListener('click', pinClickHandler);

      fragment.appendChild(pin);
    });

    pinsContainerElement.appendChild(fragment);
  };

  var updateMainPinAddress = function () {
    var mainPinX = parseInt(mainPinElement.style.left, window.shared.RADIX_DECIMAL);
    var mainPinY = parseInt(mainPinElement.style.top, window.shared.RADIX_DECIMAL);
    var mainPinAddress = mainPinX + ', ' + mainPinY;

    window.form.setInputValue('address', mainPinAddress);
  };

  var mainPinMouseDownHandler = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    if (!isMapEnabled) {
      window.map.setEnabled(true);
      updateMainPinAddress();
    }

    var startCoords = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY
    };

    var mouseMoveHandler = function (mouseMoveEvent) {
      mouseMoveEvent.preventDefault();

      var shift = new window.utils.Point(
          startCoords.x - mouseMoveEvent.clientX,
          startCoords.y - mouseMoveEvent.clientY
      );

      var nextCoords = new window.utils.Point(
          mainPinElement.offsetLeft - shift.x,
          mainPinElement.offsetTop - shift.y
      );

      nextCoords = nextCoords.applyBoundaries(mainPinBoundaries);

      startCoords = {
        x: mouseMoveEvent.clientX,
        y: mouseMoveEvent.clientY
      };

      mainPinElement.style.left = nextCoords.x + 'px';
      mainPinElement.style.top = nextCoords.y + 'px';

      updateMainPinAddress();
    };

    var mouseUpHandler = function () {
      if (!_ads.length) {
        loadAds();
        window.form.setEnabled(true);
      }

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
})();

// конец
