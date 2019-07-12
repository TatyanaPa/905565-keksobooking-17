'use strict';

(function () {
  var MIN_PRICES_PER_NIGHT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adFormElement = document.querySelector('.ad-form');
  var typeSelectElement = adFormElement.querySelector('select[name=type]');
  var timeinSelectElement = adFormElement.querySelector('select[name=timein]');

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
    window.setSelectValue('timein', event.target.value);
    window.setSelectValue('timeout', event.target.value);
  };

  typeSelectElement.addEventListener('change', handleChangePropertyType);
  timeinSelectElement.addEventListener('change', handleChangeTimeIn);
})();
// конец
