'use strict';

(function () {
  // Создает и возвращает элемент метки на основе входных данных
  window.createMapPinNode = function (data) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);
    var pinElementCover = pinElement.querySelector('img');

    pinElement.style.left = data.location.x + 'px';
    pinElement.style.top = data.location.y + 'px';
    pinElementCover.src = data.author.avatar;
    pinElementCover.alt = data.offer.title;

    return pinElement;
  };
})();
