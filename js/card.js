'use strict';

(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplateElement.cloneNode(true);

  var avatarImgElement = cardElement.querySelector('.popup__avatar');
  var closeButtonElement = cardElement.querySelector('.popup__close');
  var titleElement = cardElement.querySelector('.popup__title');
  var addressElement = cardElement.querySelector('.popup__text--address');
  var priceElement = cardElement.querySelector('.popup__text--price');
  var typeElement = cardElement.querySelector('.popup__type');
  var capacityElement = cardElement.querySelector('.popup__text--capacity');
  var timeInTimeOutElement = cardElement.querySelector('.popup__text--time');
  var featureElements = cardElement.querySelectorAll('.popup__feature');
  var photosElement = cardElement.querySelector('.popup__photos');
  var descriptionElement = cardElement.querySelector('.popup__description');

  avatarImgElement.src = 'img/muffin-grey.svg';
  document.querySelector('.map').appendChild(cardElement);

  var checkPropertiesExistance = window.shared.checkPropertiesExistance;

  var getPropertyNameByType = function (type) {
    switch (type) {
      case 'palace':
        return 'Дворец';
      case 'flat':
        return 'Квартира';
      case 'house':
        return 'Дом';
      case 'bungalo':
        return 'Бунгало';
      default:
        return '';
    }
  };

  var getPropertyCapacity = function (rooms, guests) {
    return rooms + ' комнаты для ' + guests + ' гостей';
  };

  var getPropertyTimeInTimeOut = function (timein, timeout) {
    return 'Заезд после ' + timein + ', выезд до ' + timeout;
  };

  window.card = {
    show: function (ad) {
      if (typeof ad !== 'object') {
        return;
      }

      var author = ad.author;
      var offer = ad.offer;

      window.card.hide();

      if (checkPropertiesExistance(author, author.avatar)) {
        avatarImgElement.src = author.avatar;
      }

      if (checkPropertiesExistance(offer, offer.title)) {
        titleElement.textContent = offer.title;
      }

      if (checkPropertiesExistance(offer, offer.address)) {
        addressElement.textContent = offer.address;
      }

      if (checkPropertiesExistance(offer, offer.price)) {
        priceElement.textContent = offer.price + ' ₽/ночь';
      }

      if (checkPropertiesExistance(offer, offer.type)) {
        typeElement.textContent = getPropertyNameByType(offer.type);
      }

      if (checkPropertiesExistance(offer, offer.rooms, offer.guests)) {
        capacityElement.textContent = getPropertyCapacity(offer.rooms, offer.guests);
      }

      if (checkPropertiesExistance(offer, offer.avatar)) {
        timeInTimeOutElement.textContent = getPropertyTimeInTimeOut(offer.checkin, offer.checkout);
      }

      featureElements.forEach(function (featureElement) {
        featureElement.style.display = 'none';
      });

      if (checkPropertiesExistance(offer, offer.features)) {
        offer.features.forEach(function (feature) {
          var featureElement = cardElement.querySelector('.popup__feature--' + feature);
          if (featureElement) {
            featureElement.style.display = 'inline-block';
          }
        });
      }

      offer.photos.forEach(function (photo) {
        var cardPhotoElement = document.createElement('img');
        cardPhotoElement.classList.add('popup__photo');
        cardPhotoElement.src = photo;
        cardPhotoElement.alt = offer.title;

        photosElement.appendChild(cardPhotoElement);
      });

      if (checkPropertiesExistance()) {
        descriptionElement.textContent = offer.description;
      }

      var cardKeyDownHandler = function (evt) {
        if (evt.keyCode === window.shared.ESCAPE_KEY_CODE) {
          document.removeEventListener('keydown', cardKeyDownHandler);
          window.card.hide();
        }
      };

      var cardCloseButtonClickHandler = function () {
        closeButtonElement.removeEventListener('click', cardCloseButtonClickHandler);
        window.card.hide();
      };

      closeButtonElement.addEventListener('click', cardCloseButtonClickHandler);
      document.addEventListener('keydown', cardKeyDownHandler);

      cardElement.style.display = 'block';
    },
    hide: function () {
      cardElement.style.display = 'none';

      avatarImgElement.src = 'img/muffin-grey.svg';
      titleElement.textContent = '';
      addressElement.textContent = '';
      priceElement.textContent = '';
      typeElement.textContent = '';
      capacityElement.textContent = '';
      timeInTimeOutElement.textContent = '';
      descriptionElement.textContent = '';

      while (photosElement.hasChildNodes()) {
        photosElement.removeChild(photosElement.lastChild);
      }
    }
  };
})();
