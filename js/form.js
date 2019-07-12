'use strict';

(function () {
  var MIN_PRICES_PER_NIGHT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adFormElement = document.querySelector('.ad-form');

  var propertyTypeSelect = adFormElement.querySelector('select[name=type]');
  var timeinSelect = adFormElement.querySelector('select[name=timein]');
  var timeoutSelect = adFormElement.querySelector('select[name=timeout]');
  var roomsSelect = adFormElement.querySelector('select[name=rooms]');
  var guestsSelect = adFormElement.querySelector('select[name=capacity]');

  // Активирует/деактивирует форму добавления объявления
  window.setAdFormEnabled = function (enabled) {
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

  // Устанавливает значение поля
  window.setInputValue = function (name, value) {
    var input = adFormElement.querySelector('input[name=' + name + ']');
    input.value = value;
  };

  // Изменяет значение выпадающего меню (select)
  window.setSelectValue = function (name, value) {
    var select = adFormElement.querySelector('select[name=' + name + ']');
    var selectOptions = select.options;
    for (var i = 0; i < selectOptions.length; i++) {
      if (selectOptions[i].value === value) {
        selectOptions[i].selected = true;
        return;
      }
    }
  };

  var validateRoomsAndGuests = function () {
    if (roomsSelect.value !== guestsSelect.value) {
      roomsSelect.setCustomValidity('Количество комнат и гостей должно совпадать');
    } else {
      roomsSelect.setCustomValidity('');
    }
  };

  var propertyTypeSelectChangeHandler = function (evt) {
    var priceInput = document.getElementById('price');

    var offerType = evt.target.value;
    var minPricePerNight = MIN_PRICES_PER_NIGHT[offerType];

    if (minPricePerNight !== undefined) {
      priceInput.min = minPricePerNight;
      priceInput.placeholder = minPricePerNight;
    }
  };

  var timeInSelectChangeHandler = function (evt) {
    window.setSelectValue('timeout', evt.target.value);
  };

  var timeOutSelectChangeHandler = function (evt) {
    window.setSelectValue('timein', evt.target.value);
  };

  var roomsSelectChangeHandler = function () {
    validateRoomsAndGuests();
  };

  var guestsSelectChangeHandler = function () {
    validateRoomsAndGuests();
  };

  propertyTypeSelect.addEventListener('change', propertyTypeSelectChangeHandler);
  timeinSelect.addEventListener('change', timeInSelectChangeHandler);
  timeoutSelect.addEventListener('change', timeOutSelectChangeHandler);
  roomsSelect.addEventListener('change', roomsSelectChangeHandler);
  guestsSelect.addEventListener('change', guestsSelectChangeHandler);
})();
// конец
