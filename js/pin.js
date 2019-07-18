'use strict';

(function () {
  // Создает и возвращает элемент метки на основе входных данных
  window.createMapPinNode = function (data) {
    var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinElementCoverElement = pinElement.querySelector('img');

    pinElement.style.left = data.location.x + 'px';
    pinElement.style.top = data.location.y + 'px';
    pinElementCoverElement.src = data.author.avatar;
    pinElementCoverElement.alt = data.offer.title;

    return pinElement;
  };
})();
