'use strict';

var ANNOUNCEMENTS_TITLES = ['Первое', 'Второе', 'Третье', 'Четвертое', 'Пятое', 'Шестое', 'Седьмое', 'Восьмое'];
var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_AVAILABLE_Y = 130;
var MAX_AVAILABLE_Y = 630;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var typeSelect = adForm.querySelector('select[name=type]');
var timeinSelect = adForm.querySelector('select[name=timein]');

var mainPinCoordinates = {
  x: 0,
  y: 0
};

var isMapActivated = false;
var isMovingMainPin = false;

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
// var handleMainMapPinMouseDown = function (event) {
//   if (!isMapActivated) {
//     // Активируем карту и форму добавления объявления
//     setMapEnabled(true);
//     setAdFormEnabled(true);

//     // Генерируем и добавляем метки на карту
//     generateAndAppendMapPins();

//     // Считываем значения начальных координат метки
//     mainPinCoordinates.x = parseInt(mapPinMain.style.left, 10).toString();
//     mainPinCoordinates.y = parseInt(mapPinMain.style.top, 10).toString();

//     // Записываем координаты метки в поле "адрес"
//     setInputValue('address', mainPinCoordinates.x + ', ' + mainPinCoordinates.y);

//     isMapActivated = true;
//   }

//   sdrag(handleMainMapPinMouseMove, handleMainMapPinMouseUp);

//   // isMovingMainPin = true;
//   // map.addEventListener('mousemove', handleMainMapPinMouseMove, false);
// };

// var handleMainMapPinMouseMove = function (event) {

//   // Считываем значения координат метки
//   mainPinCoordinates.x = event.pageX;
//   mainPinCoordinates.y = event.pageY;

//   mapPinMain.style.left = mainPinCoordinates.x + "px";
//   mapPinMain.style.top = mainPinCoordinates.y + "px";

//   // Записываем координаты метки в поле "адрес"
//   setInputValue('address', mainPinCoordinates.x + ', ' + mainPinCoordinates.y);

//   // map.addEventListener("mouseup", handleMainMapPinMouseUp, false);
// };

// var handleMainMapPinMouseUp = function (event) {
//   // document.removeEventListener("mousemove", handleMouseMove, false);
//   // document.removeEventListener("mouseup", handleMainMapPinMouseUp, false);
// };

document.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var dragged = false;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (dragged) {
      var onClickPreventDefault = function (evt) {
        evt.preventDefault();
        mapPinMain.removeEventListener('click', onClickPreventDefault)
      };
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }

  };

  map.addEventListener('mousemove', onMouseMove);
  map.addEventListener('mouseup', onMouseUp);
});

var setSelectValue = function (select, value) {
  var selOptions = select.options;
  for (var i = 0; i < selOptions.length; i++) {
    if (selOptions[i].value === value) {
      selOptions[i].selected = true;
      return;
    }
  }
};

var handleChangePropertyType = function (event) {
  var minPricesPerNight = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };

  var offerType = event.target.value;
  var currMinPricePerNight = minPricesPerNight[offerType];

  var priceInput = document.getElementById('price');

  if (currMinPricePerNight !== undefined) {
    priceInput.min = currMinPricePerNight;
    priceInput.placeholder = currMinPricePerNight;
  }
};

var handleChangeTimeInTimeOut = function (event) {
  var timeinSelect = adForm.querySelector('select[name=timein]');
  var timeoutSelect = adForm.querySelector('select[name=timeout]');

  setSelectValue(timeinSelect, event.target.value);
  setSelectValue(timeoutSelect, event.target.value);
};


typeSelect.addEventListener('change', handleChangePropertyType);
timeinSelect.addEventListener('change', handleChangeTimeInTimeOut);

mapPinMain.addEventListener('mousedown', handleMainMapPinMouseDown, false);
// mapPinMain.addEventListener('mouseup', handleMainMapPinMouseUp);
