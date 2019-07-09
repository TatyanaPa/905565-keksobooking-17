'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinsElement = document.querySelector('.map__pins');
  var mainPinElement = document.querySelector('.map__pin--main');

  var isMapActivated = false;

  // Активирует/деактивирует карту
  var setMapEnabled = function (enabled) {
    if (enabled) {
      mapElement.classList.remove('map--faded');
    } else {
      mapElement.classList.add('map--faded');
    }
  };

  // Генерирует и возвращает массив случайных объявлений
  var generateAnnouncements = function (count) {
    var announcements = [];

    for (var i = 0; i < count; i++) {
      var x = window.getRandomInteger(window.PIN_SIZE.WIDTH, pinsElement.offsetWidth - window.PIN_SIZE.WIDTH);
      var y = window.getRandomInteger(window.MIN_AVAILABLE_Y, window.MAX_AVAILABLE_Y - window.PIN_SIZE.HEIGHT);
      var type = window.HOUSING_TYPES[window.getRandomInteger(0, window.HOUSING_TYPES.length - 1)];
      var title = window.ANNOUNCEMENTS_TITLES[i];
      var avatar = window.makeAvatarPathString(i + 1);

      announcements.push(window.createAnnouncement(x, y, type, title, avatar));
    }

    return announcements;
  };

  // Генерирует и добавляет метки на карту
  var generateAndAppendMapPins = function (count) {
    var announcements = generateAnnouncements(count);
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var pin = window.createMapPinNode(announcements[i]);
      fragment.appendChild(pin);
    }

    pinsElement.appendChild(fragment);
  };

  var handleMouseDownMainPin = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    if (!isMapActivated) {
      setMapEnabled(true);
      window.setAdFormEnabled(true);

      var pinCount = window.ANNOUNCEMENTS_TITLES.length;
      generateAndAppendMapPins(pinCount);

      var mainPinX = parseInt(mainPinElement.style.left, 10).toString();
      var mainPinY = parseInt(mainPinElement.style.top, 10).toString();
      var mainPinAddress = mainPinX + ', ' + mainPinY;
      window.setInputValue('address', mainPinAddress);

      isMapActivated = true;
    }

    var startCoords = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY
    };

    var handleMouseMove = function (mouseMoveEvent) {
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

      window.setInputValue(
          'address',
          String(mainPinElement.offsetLeft - shift.x) + ', ' + String(mainPinElement.offsetTop - shift.y)
      );
    };

    var handleMouseUp = function (mouseUpEvent) {
      mouseUpEvent.preventDefault();

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  mainPinElement.addEventListener('mousedown', handleMouseDownMainPin);
})();
