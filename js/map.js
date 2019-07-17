'use strict';

(function () {
  var PIN_WIDTH = 40;
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;

  var MIDDLE_LOWEST_PRICE = 10000;
  var MIDDLE_HIGHEST_PRICE = 50000;
  var LOW_HIGHEST_PRICE = 10000;
  var HIGH_LOWEST_PRICE = 50000;

  var mapElement = document.querySelector('.map');
  var pinsElement = mapElement.querySelector('.map__pins');
  var mainPinElement = pinsElement.querySelector('.map__pin--main');

  var mapFilterElement = mapElement.querySelector('.map__filters');
  var typeSelectElement = mapFilterElement.querySelector('select[name=housing-type]');
  var priceSelectElement = mapFilterElement.querySelector('select[name=housing-price]');
  var roomsSelectElement = mapFilterElement.querySelector('select[name=housing-rooms]');
  var guestsSelectElement = mapFilterElement.querySelector('select[name=housing-guests]');
  var featuresFieldsetElement = mapFilterElement.querySelector('fieldset#housing-features');
  var featureFilterElements = mapFilterElement.querySelectorAll('input[name=features]');

  var isMapEnabled = false;
  var initialMainPinCoords = {
    x: mainPinElement.style.left,
    y: mainPinElement.style.top
  };

  var _ads = [];

  var getInitalFilters = function () {
    return {
      limit: 5,
      type: 'any',
      price: 'any',
      rooms: 'any',
      guests: 'any',
      features: {
        wifi: false,
        dishwasher: false,
        parking: false,
        washer: false,
        elevator: false,
        conditioner: false
      }
    };
  };

  var filters = getInitalFilters();

  window.map = {
    // Активирует/деактивирует карту
    setEnabled: function (enabled) {
      if (enabled) {
        mapElement.classList.remove('map--faded');
      } else {
        clearMapPins();
        window.card.hide();
        window.map.resetMainPin();
        mapElement.classList.add('map--faded');
      }

      setFiltersEnabled(enabled);
      isMapEnabled = enabled;
    },
    resetMainPin: function () {
      mainPinElement.style.left = initialMainPinCoords.x;
      mainPinElement.style.top = initialMainPinCoords.y;

      updateMainPinAddress();
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

    // Фильтр по стоимости
    if (filters.price !== 'any') {
      filteredAds = filteredAds.filter(function (ad) {
        switch (filters.price) {
          case 'middle':
            return ad.offer.price >= MIDDLE_LOWEST_PRICE && ad.offer.price <= MIDDLE_HIGHEST_PRICE;
          case 'low':
            return ad.offer.price < LOW_HIGHEST_PRICE;
          case 'high':
            return ad.offer.price > HIGH_LOWEST_PRICE;
          default:
            return false;
        }
      });
    }

    // Фильтр по количеству комнат
    if (filters.rooms !== 'any') {
      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.rooms === parseInt(filters.rooms, 10);
      });
    }

    // Фильтр по количеству гостей
    if (filters.guests !== 'any') {
      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.guests === parseInt(filters.guests, 10);
      });
    }

    // Фильтр по фичам
    Object.keys(filters.features).forEach(function (feature) {
      if (filters.features[feature]) {
        filteredAds = filteredAds.filter(function (ad) {
          return ad.offer.features.includes(feature);
        });
      }
    });

    // Ограничиваем количество
    if (filters.limit >= 0) {
      filteredAds = filteredAds.slice(0, filters.limit);
    }

    return filteredAds;
  };

  var setFiltersEnabled = function (enabled) {
    var selectElements = mapFilterElement.querySelectorAll('select');

    selectElements.forEach(function (selectElement) {
      selectElement.disabled = !enabled;
      if (!enabled) {
        selectElement.selectedIndex = 0;
      }
    });

    if (!enabled) {
      featureFilterElements.forEach(function (featureElement) {
        featureElement.checked = false;
      });
    }

    featuresFieldsetElement.disabled = !enabled;

    filters = getInitalFilters();
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

    window.card.hide();
    clearMapPins();

    filteredAds.forEach(function (ad, index) {
      var pin = window.createMapPinNode(ad);
      pin.dataset.id = index;

      var pinClickHandler = function (evt) {
        var id = evt.currentTarget.dataset.id;
        window.card.show(filteredAds[id]);
      };

      pin.addEventListener('click', pinClickHandler);

      fragment.appendChild(pin);
    });

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

      var nextX = mainPinElement.offsetLeft - shift.x;
      var nextY = mainPinElement.offsetTop - shift.y;

      var mapWidth = mapElement.clientWidth;
      var pinMinX = PIN_WIDTH;
      var pinMaxX = mapWidth - PIN_WIDTH;

      if (nextX <= pinMinX || nextX >= pinMaxX || nextY <= PIN_MIN_Y || nextY >= PIN_MAX_Y) {
        return;
      }

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

  var priceFilterChangeHandler = function (evt) {
    filters.price = evt.target.value;
    renderMapPins(_ads);
  };

  var roomsFilterChangeHandler = function (evt) {
    filters.rooms = evt.target.value;
    renderMapPins(_ads);
  };

  var guestsFilterChangeHandler = function (evt) {
    filters.guests = evt.target.value;
    renderMapPins(_ads);
  };

  var featureFilterChangeHandler = function (evt) {
    filters.features[evt.target.value] = evt.target.checked;
    renderMapPins(_ads);
  };

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);
  typeSelectElement.addEventListener('change', typeFilterChangeHandler);
  priceSelectElement.addEventListener('change', priceFilterChangeHandler);
  roomsSelectElement.addEventListener('change', roomsFilterChangeHandler);
  guestsSelectElement.addEventListener('change', guestsFilterChangeHandler);

  featureFilterElements.forEach(function (featureFilterElement) {
    featureFilterElement.addEventListener('change', featureFilterChangeHandler);
  });
})();

// конец
