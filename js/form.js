'use strict';

(function () {
  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  var NO_GUESTS_OPTION = 0;
  var MAX_ROOMS_OPTION = 100;

  var formElement = document.querySelector('.ad-form');

  var avatarInputElement = formElement.querySelector('input[name=avatar]');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__preview > img');

  var typeSelectElement = formElement.querySelector('select[name=type]');
  var priceInputElement = formElement.querySelector('input[name=price]');
  var timeinSelectElement = formElement.querySelector('select[name=timein]');
  var timeoutSelectElement = formElement.querySelector('select[name=timeout]');
  var roomsSelectElement = formElement.querySelector('select[name=rooms]');
  var guestsSelectElement = formElement.querySelector('select[name=capacity]');

  var imagesInputElement = formElement.querySelector('input[name=images]');
  var photosContainerElement = formElement.querySelector('.ad-form__photo-container');

  window.form = {
    // Активирует/деактивирует форму добавления объявления
    setEnabled: function (enabled) {
      if (enabled) {
        formElement.classList.remove('ad-form--disabled');
      } else {
        resetForm();
        formElement.classList.add('ad-form--disabled');
      }

      var fieldsetElements = formElement.querySelectorAll('fieldset');
      fieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = !enabled;
      });
    },
    // Устанавливает значение поля
    setInputValue: function (name, value) {
      var inputElement = formElement.querySelector('input[name=' + name + ']');
      inputElement.value = value;
    },
    // Изменяет значение выпадающего меню
    setSelectValue: function (name, value) {
      var selectElement = formElement.querySelector('select[name=' + name + ']');
      var options = selectElement.options;

      Object.keys(options).forEach(function (key) {
        if (options[key].value === value) {
          options[key].selected = true;
        }
      });
    }
  };

  var resetForm = function () {
    var selectElements = formElement.querySelectorAll('select');
    var inputElements = formElement.querySelectorAll('input[type=text],input[type=number]');
    var checkboxElements = formElement.querySelectorAll('input[type=checkbox]');
    var imageElements = formElement.querySelectorAll('.ad-form__photo');
    var descriptionElement = formElement.querySelector('textarea[name=description]');

    selectElements.forEach(function (selectElement) {
      selectElement.selectedIndex = 0;
    });

    inputElements.forEach(function (inputElement) {
      inputElement.value = '';
    });

    checkboxElements.forEach(function (checkboxElement) {
      checkboxElement.checked = false;
    });

    imageElements.forEach(function (imageElement) {
      photosContainerElement.removeChild(imageElement);
    });

    avatarPreviewElement.src = 'img/muffin-grey.svg';
    typeSelectElement.selectedIndex = 1;
    priceInputElement.placeholder = FLAT_MIN_PRICE;
    descriptionElement.value = '';

    window.map.resetMainPin();
  };

  var getMinPricePerNight = function (offerType) {
    switch (offerType) {
      default:
      case 'bungalo':
        return BUNGALO_MIN_PRICE;
      case 'flat':
        return FLAT_MIN_PRICE;
      case 'house':
        return HOUSE_MIN_PRICE;
      case 'palace':
        return PALACE_MIN_PRICE;
    }
  };

  var validateRoomsAndGuests = function () {
    var roomsSelectedOption = parseInt(roomsSelectElement.value, window.shared.RADIX_DECIMAL);
    var guestsSelectedOption = parseInt(guestsSelectElement.value, window.shared.RADIX_DECIMAL);

    if (roomsSelectedOption === MAX_ROOMS_OPTION) {
      if (guestsSelectedOption !== NO_GUESTS_OPTION) {
        roomsSelectElement.setCustomValidity('Помещение слишком большое для гостей');
        return false;
      }
    } else {
      if (guestsSelectedOption === NO_GUESTS_OPTION) {
        roomsSelectElement.setCustomValidity('Недостаточно комнат');
        return false;
      }

      if (roomsSelectedOption < guestsSelectedOption) {
        roomsSelectElement.setCustomValidity(
            'Количество комнат должно быть больше или равно количествую гостей'
        );
        return false;
      }
    }

    roomsSelectElement.setCustomValidity('');
    return true;
  };

  var avatarSelectHandler = function () {
    var file = avatarInputElement.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();

    reader.addEventListener('load', function () {
      avatarPreviewElement.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var imagesSelectHandler = function () {
    var files = imagesInputElement.files;
    if (!files || !files.length) {
      return;
    }

    Object.keys(files).forEach(function (key) {
      var reader = new FileReader();

      reader.addEventListener('load', function (evt) {
        var imageElement = document.createElement('img');
        imageElement.classList.add('ad-form__photo');
        imageElement.src = evt.target.result;

        photosContainerElement.appendChild(imageElement);
      });

      reader.readAsDataURL(files[key]);
    });
  };

  var typeSelectChangeHandler = function (evt) {
    var offerType = evt.target.value;
    var minPricePerNight = getMinPricePerNight(offerType);

    priceInputElement.min = minPricePerNight;
    priceInputElement.placeholder = minPricePerNight;
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

  var formResetHandler = function () {
    window.map.setEnabled(false);
    window.form.setEnabled(false);
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

  avatarInputElement.addEventListener('change', avatarSelectHandler);
  typeSelectElement.addEventListener('change', typeSelectChangeHandler);
  timeinSelectElement.addEventListener('change', timeInSelectChangeHandler);
  timeoutSelectElement.addEventListener('change', timeOutSelectChangeHandler);
  roomsSelectElement.addEventListener('change', roomsSelectChangeHandler);
  guestsSelectElement.addEventListener('change', guestsSelectChangeHandler);
  imagesInputElement.addEventListener('change', imagesSelectHandler);
  formElement.addEventListener('reset', formResetHandler);
  formElement.addEventListener('submit', formSubmitHandler);
})();
