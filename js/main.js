'use strict';

var ANNOUNCEMENTS_TITLES = ['Первое', 'Второе', 'Третье', 'Четвертое', 'Пятое', 'Шестое', 'Седьмое', 'Восьмое'];
var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_AVAILABLE_Y = 130;
var MAX_AVAILABLE_Y = 630;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');

var getRandomArrayItem = function (arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

function getRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

var makeAvatarPathString = function (index) {
  var expandedIndex = index < 10 ? '0' + index : index;
  return 'img/avatars/user' + expandedIndex + '.png';
};

// Создаёт и возвращает объект объявления на основе входных данных
var createAnnouncement = function (avatarIndex, type, announcementTitle, x, y) {
  return {
    author: {
      avatar: makeAvatarPathString(avatarIndex),
      announcementTitle: announcementTitle
    },
    offer: {
      type: type
    },
    location: {
      x: x + 'px',
      y: y + 'px'
    }
  };
};

// Генерирует и возвращает массив случайных объявлений
var generateAnnouncements = function () {
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var announcements = [];

  for (var i = 1; i < ANNOUNCEMENTS_TITLES.length + 1; i++) {
    var currentType = getRandomArrayItem(HOUSING_TYPES);
    var currentX = getRandomInteger(PinSize.WIDTH, mapPins.offsetWidth - PinSize.WIDTH);
    var currentY = getRandomInteger(MIN_AVAILABLE_Y, MAX_AVAILABLE_Y - PinSize.HEIGHT);
    var currentTitle = ANNOUNCEMENTS_TITLES[i - 1];

    var announcement = createAnnouncement(i, currentType, currentTitle, currentX, currentY);
    announcements.push(announcement);
  }

  return announcements;
};

// Создает и возвращает элемент метки на основе входных данных
var createMapPinNode = function (data) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementCover = pinElement.querySelector('img');

  pinElement.style.left = data.location.x;
  pinElement.style.top = data.location.y;
  pinElementCover.src = data.author.avatar;
  pinElementCover.alt = data.author.announcementTitle;

  return pinElement;
};

// Генерирует и добавляет метки на карту
var generateAndAppendMapPins = function () {
  var announcements = generateAnnouncements();
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < announcements.length; i++) {
    var pin = createMapPinNode(announcements[i]);
    fragment.appendChild(pin);
  }

  mapPins.appendChild(fragment);
};

// Активирует/деактивирует карту
var setMapEnabled = function (enabled) {
  if (enabled) {
    map.classList.remove('map--faded');
  } else {
    map.classList.add('map--faded');
  }
};

// Активирует/деактивирует форму добавления объявления
var setAdFormEnabled = function (enabled) {
  if (enabled) {
    adForm.classList.remove('ad-form--disabled');
  } else {
    adForm.classList.add('ad-form--disabled');
  }

  var fieldsets = adForm.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = !enabled;
  }
};

// Устанавливает значение поля
var setInputValue = function (inputId, value) {
  var input = document.getElementById(inputId);
  input.value = value;
};

// Обработчик нажатия на основную метку
var handleMainPinClick = function () {
  // Активируем карту и форму добавления объявления
  setMapEnabled(true);
  setAdFormEnabled(true);

  // Генерируем и добавляем метки на карту
  generateAndAppendMapPins();

  // Записываем координаты метки в поле "адрес"
  var x = parseInt(mapPinMain.style.left, 10).toString();
  var y = parseInt(mapPinMain.style.top, 10).toString();

  setInputValue('address', x + ', ' + y);
};

mapPinMain.addEventListener('click', handleMainPinClick);
