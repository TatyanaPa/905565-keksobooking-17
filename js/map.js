'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinsElement = document.querySelector('.map__pins');
  var mainPinElement = document.querySelector('.map__pin--main');

  var mapFilters = document.querySelector('.map__filters');
  var housingTypeSelector = mapFilters.querySelector('select[name=housing-type]');

  var isMapActivated = false;

  var announcements = [];
  var filteredAnnouncements = [];

  var announcementFilters = {
    limit: 5,
    type: 'any'
  };

  var handleChangeHousingTypeFilter = function (evt) {
    announcementFilters.type = evt.target.value;
    filteredAnnouncements = applyFilters();
    renderMapPins(filteredAnnouncements);
  };

  // Активирует/деактивирует карту
  var setMapEnabled = function (enabled) {
    if (enabled) {
      mapElement.classList.remove('map--faded');
    } else {
      mapElement.classList.add('map--faded');
    }
  };

  var applyFilters = function () {
    filteredAnnouncements = announcements.slice();

    // Фильтруем по типу жилья
    if (announcementFilters.type !== 'any') {
      filteredAnnouncements = filteredAnnouncements.filter(function (announcement) {
        return announcement.offer.type === announcementFilters.type;
      });
    }

    // Ограничиваем количество
    if (announcementFilters.limit >= 0) {
      filteredAnnouncements = filteredAnnouncements.slice(0, announcementFilters.limit);
    }

    return filteredAnnouncements;
  };

  var clearMapPins = function () {
    var pins = pinsElement.querySelectorAll('.map__pin');
    pins.forEach(function (pinElement) {
      if (pinElement !== mainPinElement) {
        pinsElement.removeChild(pinElement);
      }
    });
  };

  // Генерирует и добавляет метки на карту
  var renderMapPins = function () {
    clearMapPins();

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < filteredAnnouncements.length; i++) {
      var pin = window.createMapPinNode(filteredAnnouncements[i]);
      pin.dataset.id = i;

      var handleClickMapPin = function (id) {
        hideAnnouncementCard();
        renderAnnouncementCard(filteredAnnouncements[id]);
      };

      pin.addEventListener('click', function (evt) {
        handleClickMapPin(evt.currentTarget.dataset.id);
      });

      fragment.appendChild(pin);
    }

    pinsElement.appendChild(fragment);
  };

  var loadAnnouncements = function () {
    window.loadAnnouncements(
        function (data) {
          announcements = data;
          filteredAnnouncements = applyFilters();
          renderMapPins(filteredAnnouncements);
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

  var handlePressEscapeOnAnnouncementCard = function (evt) {
    if (evt.keyCode === 27) {
      hideAnnouncementCard();
    }
  };

  var hideAnnouncementCard = function () {
    var announcementCard = mapElement.querySelector('.map__card');

    if (announcementCard) {
      announcementCard.removeEventListener('keypress', handlePressEscapeOnAnnouncementCard);
      mapElement.removeChild(announcementCard);
    }
  };

  var renderAnnouncementCard = function (announcement) {
    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var cardElement = cardTemplate.cloneNode(true);

    var cardCloseButtonElement = cardElement.querySelector('.popup__close');

    document.addEventListener('keydown', handlePressEscapeOnAnnouncementCard);
    cardCloseButtonElement.addEventListener('click', function () {
      hideAnnouncementCard();
    });

    var author = announcement.author;
    var offer = announcement.offer;

    var cardAvatarElement = cardElement.querySelector('.popup__avatar');
    cardAvatarElement.src = author.avatar;

    var cardTitleElement = cardElement.querySelector('.popup__title');
    cardTitleElement.innerText = offer.title;

    var cardAddressElement = cardElement.querySelector('.popup__text--address');
    cardAddressElement.innerText = offer.address;

    var cardPriceElement = cardElement.querySelector('.popup__text--price');
    cardPriceElement.innerText = offer.price + '₽/ночь';

    var cardTypeElement = cardElement.querySelector('.popup__type');
    cardTypeElement.innerText = window.getPropertyNameByType(offer.type);

    var cardCapacityElement = cardElement.querySelector('.popup__text--capacity');
    cardCapacityElement.innerText = window.getPropertyCapacity(offer.rooms, offer.guests);

    var cardTimeInTimeOutElement = cardElement.querySelector('.popup__text--time');
    cardTimeInTimeOutElement.innerText = window.getPropertyTimeInTimeOut(offer.checkin, offer.checkout);

    var cardFeatureElements = cardElement.querySelectorAll('.popup__feature');
    cardFeatureElements.forEach(function (featureElement) {
      featureElement.style.display = 'none';
      featureElement.classList.forEach(function (className) {
        offer.features.forEach(function (featureName) {
          if (className.endsWith(featureName)) {
            featureElement.style.display = 'inline-block';
          }
        });
      });
    });

    var cardPhotos = cardElement.querySelector('.popup__photos');

    while (cardPhotos.hasChildNodes()) {
      cardPhotos.removeChild(cardPhotos.lastChild);
    }

    for (var i = 0; i < offer.photos.length; i++) {
      var cardPhoto = document.createElement('img');
      cardPhoto.classList.add('popup__photo');
      cardPhoto.width = 45;
      cardPhoto.height = 40;
      cardPhoto.src = offer.photos[i];
      cardPhoto.alt = offer.title;

      cardPhotos.appendChild(cardPhoto);
    }

    var cardDescriptionElement = cardElement.querySelector('.popup__description');
    cardDescriptionElement.innerText = offer.description;

    mapElement.appendChild(cardElement);
  };

  mainPinElement.addEventListener('mousedown', handleMouseDownMainPin);
  housingTypeSelector.addEventListener('change', handleChangeHousingTypeFilter);
})();
