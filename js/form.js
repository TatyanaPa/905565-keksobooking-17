'use strict';

(function () {
  var MIN_PRICES_PER_NIGHT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var formElement = document.querySelector('.ad-form');
  var typeSelect = formElement.querySelector('select[name=type]');
  var timeinSelect = formElement.querySelector('select[name=timein]');
  var timeoutSelect = formElement.querySelector('select[name=timeout]');
  var roomsSelect = formElement.querySelector('select[name=rooms]');
  var guestsSelect = formElement.querySelector('select[name=capacity]');

  window.form = {
    // Активирует/деактивирует форму добавления объявления
    setEnabled: function (enabled) {
      if (enabled) {
        formElement.classList.remove('ad-form--disabled');
      } else {
        var selectElements = formElement.querySelectorAll('select');
        var inputElements = formElement.querySelectorAll('input[type=text],input[type=number]');
        var checkboxElements = formElement.querySelectorAll('input[type=checkbox]');

        selectElements.forEach(function (selectElement) {
          selectElement.selectedIndex = -1;
        });

        inputElements.forEach(function (inputElement) {
          inputElement.value = '';
        });

        checkboxElements.forEach(function (checkboxElement) {
          checkboxElement.checked = false;
        });

        formElement.classList.add('ad-form--disabled');
      }

      var fieldsets = formElement.querySelectorAll('fieldset');
      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].disabled = !enabled;
      }
    },
    // Устанавливает значение поля
    setInputValue: function (name, value) {
      var input = formElement.querySelector('input[name=' + name + ']');
      input.value = value;
    },
    // Изменяет значение выпадающего меню
    setSelectValue: function (name, value) {
      var select = formElement.querySelector('select[name=' + name + ']');
      var selectOptions = select.options;
      for (var i = 0; i < selectOptions.length; i++) {
        if (selectOptions[i].value === value) {
          selectOptions[i].selected = true;
          break;
        }
      }
    }
  };

  var validateRoomsAndGuests = function () {
    if (roomsSelect.value !== guestsSelect.value) {
      roomsSelect.setCustomValidity('Количество комнат и гостей должно совпадать');
      return false;
    }

    roomsSelect.setCustomValidity('');
    return true;
  };

  var typeSelectChangeHandler = function (evt) {
    var priceInput = formElement.querySelector('input[name=price]');

    var offerType = evt.target.value;
    var minPricePerNight = MIN_PRICES_PER_NIGHT[offerType];

    if (minPricePerNight !== undefined) {
      priceInput.min = minPricePerNight;
      priceInput.placeholder = minPricePerNight;
    }
  };

  var timeInSelectChangeHandler = function (evt) {
    window.form.setSelectValue('timeout', evt.target.value);
  };

  var timeOutSelectChangeHandler = function (evt) {
    window.form.setSelectValue('timein', evt.target.value);
  };

  var roomsSelectChangeHandler = function () {
    validateRoomsAndGuests();
  };

  var guestsSelectChangeHandler = function () {
    validateRoomsAndGuests();
  };

  var formSubmitHandler = function (evt) {
    if (evt) {
      evt.preventDefault();
    }

    if (!validateRoomsAndGuests()) {
      return;
    }

    var formData = new FormData(formElement);

    var onSuccess = function () {
      window.form.setEnabled(false);
      window.map.setEnabled(false);
      window.xhr.showSuccessMessage('Ваше объявление успешно размещено!');
    };

    var onError = function () {
      window.xhr.showErrorMessage('Ошибка отправки формы', formSubmitHandler);
    };

    window.xhr.send('https://js.dump.academy/keksobooking', formData, onSuccess, onError);
  };

  typeSelect.addEventListener('change', typeSelectChangeHandler);
  timeinSelect.addEventListener('change', timeInSelectChangeHandler);
  timeoutSelect.addEventListener('change', timeOutSelectChangeHandler);
  roomsSelect.addEventListener('change', roomsSelectChangeHandler);
  guestsSelect.addEventListener('change', guestsSelectChangeHandler);
  formElement.addEventListener('submit', formSubmitHandler);
})();
