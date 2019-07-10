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

  // Генерирует и добавляет метки на карту
  var renderMapPins = function (announcements) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < announcements.length; i++) {
      var pin = window.createMapPinNode(announcements[i]);
      fragment.appendChild(pin);
    }

    pinsElement.appendChild(fragment);
  };

  var loadAnnouncements = function () {
    window.loadAnnouncements(
        function (data) {
          renderMapPins(data);
        },
        function (error) {
          renderLoadAnnouncementsError(error);
        }
    );
  };

  var renderLoadAnnouncementsError = function (error) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorElementText = errorElement.querySelector('.error__message');
    var errorElementButton = errorElement.querySelector('.error__button');

    errorElementText.innerText = error;

    var mainElement = document.querySelector('main');
    mainElement.appendChild(errorElement);

    errorElementButton.addEventListener('click', function () {
      mainElement.removeChild(errorElement);
      loadAnnouncements();
    });
  };

  var handleMouseDownMainPin = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    if (!isMapActivated) {
      setMapEnabled(true);
      window.setAdFormEnabled(true);

      loadAnnouncements();

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
