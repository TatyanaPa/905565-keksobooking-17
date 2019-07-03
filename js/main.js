'use strict';

var PinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');

var mapPins = map.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');


var enableAdForm = function () {
  adForm.classList.remove('ad-form--disabled');

  var fieldsets = adForm.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
};

var setAddressInputValue = function (value) {
  var addressInput = document.getElementById('address');
  addressInput.value = value;
};

var handleMainPinClick = function () {
  map.classList.remove('map--faded');

  // Делаем активной форму добавления метки
  enableAdForm();

  // Записываем координаты метки в поле "адрес"
  var x = parseInt(mapPinMain.style.left, 10).toString();
  var y = parseInt(mapPinMain.style.top, 10).toString();
  setAddressInputValue(x + ', ' + y);
};

mapPinMain.addEventListener('click', handleMainPinClick);


/* У блока .map уберем класс faded для перехода в активный режим */


/* Сгенерируем массив, состоящий из 8 объектов объявлений */

var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ANNOUNCEMENTS_TITLES = [
  'Первое', 'Второе', 'Третье', 'Четвертое',
  'Пятое', 'Шестое', 'Седьмое', 'Восьмое'
];
var MIN_AVAILABLE_Y = 130;
var MAX_AVAILABLE_Y = 630;

var makeAvatarPathString = function (index) {
  var expandedIndex = (index < 10) ? '0' + index : index;

  return 'img/avatars/user' + expandedIndex + '.png';
};

var generateAnnouncement = function (avatarIndex, type, announcementTitle, x, y) {
  return {
    'author': {
      'avatar': makeAvatarPathString(avatarIndex),
      'announcementTitle': announcementTitle
    },
    'offer': {
      'type': type
    },
    'location': {
      x: x + 'px',
      y: y + 'px'
    }
  };
};

var getRandomArrayItem = function (arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

function getRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

var fillAnnouncements = function () {
  var announcements = [];
  for (var i = 1; i < ANNOUNCEMENTS_TITLES.length + 1; i++) {
    var currentType = getRandomArrayItem(HOUSING_TYPES);
    var currentX = getRandomInteger(PinSize.WIDTH, mapPins.offsetWidth - PinSize.WIDTH);
    var currentY = getRandomInteger(MIN_AVAILABLE_Y, MAX_AVAILABLE_Y - PinSize.HEIGHT);
    var currentTitle = ANNOUNCEMENTS_TITLES[i - 1];

    var announcement = generateAnnouncement(i, currentType, currentTitle, currentX, currentY);
    announcements.push(announcement);
  }

  return announcements;
};

/* Создадим DOM-элементы на основе сгенерированных данных */

var pinTemplate = document
  .querySelector('#pin')
  .content
  .querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementCover = pinElement.querySelector('img');

  pinElement.style.left = pin.location.x;
  pinElement.style.top = pin.location.y;
  pinElementCover.src = pin.author.avatar;
  pinElementCover.alt = pin.author.announcementTitle;

  return pinElement;
};

var announcements = fillAnnouncements();
var fragment = document.createDocumentFragment();

for (var i = 0; i < announcements.length; i++) {
  fragment.appendChild(renderPin(announcements[i]));
}

mapPins.appendChild(fragment);

