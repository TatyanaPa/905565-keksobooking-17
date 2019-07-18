'use strict';

(function () {
  var mapElement = document.querySelector('.map');

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
      window.card.hide();

      var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
      var cardElement = cardTemplateElement.cloneNode(true);
      var cardCloseButtonElement = cardElement.querySelector('.popup__close');

      var author = ad.author;
      var offer = ad.offer;

      var cardAvatarElement = cardElement.querySelector('.popup__avatar');
      cardAvatarElement.src = author.avatar;

      var cardTitleElement = cardElement.querySelector('.popup__title');
      cardTitleElement.textContent = offer.title;

      var cardAddressElement = cardElement.querySelector('.popup__text--address');
      cardAddressElement.textContent = offer.address;

      var cardPriceElement = cardElement.querySelector('.popup__text--price');
      cardPriceElement.textContent = offer.price + '₽/ночь';

      var cardTypeElement = cardElement.querySelector('.popup__type');
      cardTypeElement.textContent = getPropertyNameByType(offer.type);

      var cardCapacityElement = cardElement.querySelector('.popup__text--capacity');
      cardCapacityElement.textContent = getPropertyCapacity(offer.rooms, offer.guests);

      var cardTimeInTimeOutElement = cardElement.querySelector('.popup__text--time');
      cardTimeInTimeOutElement.textContent = getPropertyTimeInTimeOut(
          offer.checkin,
          offer.checkout
      );

      var cardFeatureElements = cardElement.querySelectorAll('.popup__feature');
      cardFeatureElements.forEach(function (featureElement) {
        featureElement.style.display = 'none';
      });

      offer.features.forEach(function (feature) {
        var featureElement = cardElement.querySelector('.popup__feature--' + feature);
        if (featureElement) {
          featureElement.style.display = 'inline-block';
        }
      });

      var cardPhotosElement = cardElement.querySelector('.popup__photos');

      while (cardPhotosElement.hasChildNodes()) {
        cardPhotosElement.removeChild(cardPhotosElement.lastChild);
      }

      offer.photos.forEach(function (photo) {
        var cardPhotoElement = document.createElement('img');
        cardPhotoElement.classList.add('popup__photo');
        cardPhotoElement.src = photo;
        cardPhotoElement.alt = offer.title;

        cardPhotosElement.appendChild(cardPhotoElement);
      });

      var cardDescriptionElement = cardElement.querySelector('.popup__description');
      cardDescriptionElement.textContent = offer.description;

      var cardKeyDownHandler = function (evt) {
        if (evt.keyCode === window.shared.ESCAPE_KEY_CODE) {
          document.removeEventListener('keypress', cardKeyDownHandler);
          window.card.hide();
        }
      };

      var cardCloseButtonClickHandler = function () {
        window.card.hide();
      };

      document.addEventListener('keydown', cardKeyDownHandler);
      cardCloseButtonElement.addEventListener('click', cardCloseButtonClickHandler);

      mapElement.appendChild(cardElement);
    },
    hide: function () {
      var cardElement = mapElement.querySelector('.map__card');
      if (cardElement) {
        mapElement.removeChild(cardElement);
      }
    }
  };
})();
