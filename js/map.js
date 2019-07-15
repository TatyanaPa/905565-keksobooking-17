'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinsElement = mapElement.querySelector('.map__pins');
  var mainPinElement = pinsElement.querySelector('.map__pin--main');

  var mapFilters = mapElement.querySelector('.map__filters');
  var typeFilterSelector = mapFilters.querySelector('select[name=housing-type]');

  var isMapEnabled = false;
  var initialMainPinCoords = {
    x: mainPinElement.style.left,
    y: mainPinElement.style.top
  };

  var _ads = [];
  var filters = {
    limit: 5,
    type: 'any'
  };

  window.map = {
    // Активирует/деактивирует карту
    setEnabled: function (enabled) {
      if (enabled) {
        mapElement.classList.remove('map--faded');
      } else {
        clearMapPins();
        resetMainPin();
        window.card.hide();
        mapElement.classList.add('map--faded');
      }

      isMapEnabled = enabled;
    }
  };

  var getFilteredAds = function (ads) {
    var filteredAds = ads.slice();

    // Фильтруем по типу жилья
    if (filters.type !== 'any') {
      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.type === filters.type;
      });
    }

    // Ограничиваем количество
    if (filters.limit >= 0) {
      filteredAds = filteredAds.slice(0, filters.limit);
    }

    return filteredAds;
  };

  var clearMapPins = function () {
    var pinElements = pinsElement.querySelectorAll('.map__pin');
    pinElements.forEach(function (pinElement) {
      if (pinElement !== mainPinElement) {
        pinsElement.removeChild(pinElement);
      }
    });
  };

  var renderMapPins = function (ads) {
    var filteredAds = getFilteredAds(ads);
    var fragment = document.createDocumentFragment();

    clearMapPins();

    for (var i = 0; i < filteredAds.length; i++) {
      var pin = window.createMapPinNode(filteredAds[i]);
      pin.dataset.id = i;

      var pinClickHandler = function (id) {
        window.card.show(filteredAds[id]);
      };

      pin.addEventListener('click', function (evt) {
        pinClickHandler(evt.currentTarget.dataset.id);
      });

      fragment.appendChild(pin);
    }

    pinsElement.appendChild(fragment);
  };

  var loadAds = function () {
    var onSuccess = function (ads) {
      _ads = ads;
      renderMapPins(_ads);
    };

    var onError = function () {
      window.xhr.showErrorMessage('Ошибка загрузки объявления', loadAds);
    };

    window.xhr.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
  };

  var resetMainPin = function () {
    mainPinElement.style.left = initialMainPinCoords.x;
    mainPinElement.style.top = initialMainPinCoords.y;

    updateMainPinAddress();
  };

  var updateMainPinAddress = function () {
    var mainPinX = parseInt(mainPinElement.style.left, 10).toString();
    var mainPinY = parseInt(mainPinElement.style.top, 10).toString();
    var mainPinAddress = mainPinX + ', ' + mainPinY;

    window.form.setInputValue('address', mainPinAddress);
  };

  var mainPinMouseDownHandler = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    if (!isMapEnabled) {
      window.map.setEnabled(true);
      window.form.setEnabled(true);
      loadAds();
      updateMainPinAddress();
    }

    var startCoords = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY
    };

    var mouseMoveHandler = function (mouseMoveEvent) {
      mouseMoveEvent.preventDefault();

      var shift = {
        x: startCoords.x - mouseMoveEvent.clientX,
        y: startCoords.y - mouseMoveEvent.clientY
      };

      startCoords = {
        x: mouseMoveEvent.clientX,
        y: mouseMoveEvent.clientY
      };

      mainPinElement.style.left = mainPinElement.offsetLeft - shift.x + 'px';
      mainPinElement.style.top = mainPinElement.offsetTop - shift.y + 'px';

      updateMainPinAddress();
    };

    var mouseUpHandler = function (mouseUpEvent) {
      mouseUpEvent.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var typeFilterChangeHandler = function (evt) {
    filters.type = evt.target.value;
    renderMapPins(_ads);
  };

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
  typeFilterSelector.addEventListener('change', typeFilterChangeHandler);
})();
