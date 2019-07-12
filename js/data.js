'use strict';

(function () {
  window.ANNOUNCEMENTS_TITLES = ['Первое', 'Второе', 'Третье', 'Четвертое', 'Пятое', 'Шестое', 'Седьмое', 'Восьмое'];
  window.HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];

  window.MIN_AVAILABLE_Y = 130;
  window.MAX_AVAILABLE_Y = 630;

  window.PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
  };

  // Возвращает случайное число в диапазоне min и max
  window.getRandomInteger = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  // Возвращает путь изображения аватара
  window.makeAvatarPathString = function (index) {
    var expandedIndex = index < 10 ? '0' + index : index;
    return 'img/avatars/user' + expandedIndex + '.png';
  };

  window.getPropertyNameByType = function (type) {
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

  window.getPropertyCapacity = function (rooms, guests) {
    return rooms + ' комнаты для ' + guests + ' гостей';
  };

  window.getPropertyTimeInTimeOut = function (timein, timeout) {
    return 'Заезд после ' + timein + ', выезд до ' + timeout;
  };
})();
// конец
