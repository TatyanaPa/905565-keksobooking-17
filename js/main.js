'use strict';

var ANNOUNCEMENTS_TITLES = ['Первое', 'Второе', 'Третье', 'Четвертое', 'Пятое', 'Шестое', 'Седьмое', 'Восьмое'];
var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_PRICES_PER_NIGHT = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var MIN_AVAILABLE_Y = 130;
var MAX_AVAILABLE_Y = 630;

var isMapActivated = false;
var PinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

var mapElement = document.querySelector('.map');
var pinsElement = document.querySelector('.map__pins');
var mainPinElement = document.querySelector('.map__pin--main');

var adFormElement = document.querySelector('.ad-form');
var typeSelectElement = adFormElement.querySelector('select[name=type]');
var timeinSelectElement = adFormElement.querySelector('select[name=timein]');

// Возвращает случайное число в диапазоне min и max
var getRandomInteger = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// Возвращает путь изображения аватара
var makeAvatarPathString = function (index) {
  var expandedIndex = index < 10 ? '0' + index : index;
  return 'img/avatars/user' + expandedIndex + '.png';
};

// Активирует/деактивирует карту
var setMapEnabled = function (enabled) {
  if (enabled) {
    mapElement.classList.remove('map--faded');
  } else {
    mapElement.classList.add('map--faded');
  }
};

// Активирует/деактивирует форму добавления объявления
var setAdFormEnabled = function (enabled) {
  if (enabled) {
    adFormElement.classList.remove('ad-form--disabled');
  } else {
    adFormElement.classList.add('ad-form--disabled');
  }

  var fieldsets = adFormElement.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = !enabled;
  }
};

// Создаёт и возвращает объект объявления на основе входных данных
var createAnnouncement = function (x, y, type, title, avatar) {
  return {
    location: {
      x: x + 'px',
      y: y + 'px'
    },
    offer: {
      type: type
    },
    author: {
      avatar: avatar,
      announcementTitle: title
    }
  };
};

// Генерирует и возвращает массив случайных объявлений
var generateAnnouncements = function (count) {
  var announcements = [];

  for (var i = 0; i < count; i++) {
    var x = getRandomInteger(PinSize.WIDTH, pinsElement.offsetWidth - PinSize.WIDTH);
    var y = getRandomInteger(MIN_AVAILABLE_Y, MAX_AVAILABLE_Y - PinSize.HEIGHT);
    var type = HOUSING_TYPES[getRandomInteger(0, HOUSING_TYPES.length - 1)];
    var title = ANNOUNCEMENTS_TITLES[i];
    var avatar = makeAvatarPathString(i + 1);

    announcements.push(createAnnouncement(x, y, type, title, avatar));
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
var generateAndAppendMapPins = function (count) {
  var announcements = generateAnnouncements(count);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var pin = createMapPinNode(announcements[i]);
    fragment.appendChild(pin);
  }

  pinsElement.appendChild(fragment);
};

// Устанавливает значение поля
var setInputValue = function (name, value) {
  var input = adFormElement.querySelector('input[name=' + name + ']');
  input.value = value;
};

// Изменяет значение выпадающего меню (select)
var setSelectValue = function (name, value) {
  var select = adFormElement.querySelector('select[name=' + name + ']');
  var selectOptions = select.options;
  for (var i = 0; i < selectOptions.length; i++) {
    if (selectOptions[i].value === value) {
      selectOptions[i].selected = true;
      return;
    }
  }
};

var handleMouseDownMainPin = function (mouseDownEvent) {
  mouseDownEvent.preventDefault();

  if (!isMapActivated) {
    setMapEnabled(true);
    setAdFormEnabled(true);

    var pinCount = ANNOUNCEMENTS_TITLES.length;
    generateAndAppendMapPins(pinCount);

    var mainPinX = parseInt(mainPinElement.style.left, 10).toString();
    var mainPinY = parseInt(mainPinElement.style.top, 10).toString();
    var mainPinAddress = mainPinX + ', ' + mainPinY;
    setInputValue('address', mainPinAddress);

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

    setInputValue(
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

var handleChangePropertyType = function (event) {
  var priceInput = document.getElementById('price');

  var offerType = event.target.value;
  var minPricePerNight = MIN_PRICES_PER_NIGHT[offerType];

  if (minPricePerNight !== undefined) {
    priceInput.min = minPricePerNight;
    priceInput.placeholder = minPricePerNight;
  }
};

var handleChangeTimeIn = function (event) {
  setSelectValue('timein', event.target.value);
  setSelectValue('timeout', event.target.value);
};

mainPinElement.addEventListener('mousedown', handleMouseDownMainPin);
typeSelectElement.addEventListener('change', handleChangePropertyType);
timeinSelectElement.addEventListener('change', handleChangeTimeIn);
// конец