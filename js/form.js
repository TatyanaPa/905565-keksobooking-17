'use strict';

(function () {
  var MIN_PRICES_PER_NIGHT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var formElement = document.querySelector('.ad-form');

  var avatarInputElement = formElement.querySelector('input[name=avatar]');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__preview > img');

  var typeSelectElement = formElement.querySelector('select[name=type]');
  var timeinSelectElement = formElement.querySelector('select[name=timein]');
  var timeoutSelectElement = formElement.querySelector('select[name=timeout]');
  var roomsSelectElement = formElement.querySelector('select[name=rooms]');
  var guestsSelectElement = formElement.querySelector('select[name=capacity]');

  var imagesInputElement = formElement.querySelector('input[name=images]');
  var photoContainerElement = formElement.querySelector('.ad-form__photo-container');

  var resetButtonElement = formElement.querySelector('.ad-form__reset');

  window.form = {
    // Активирует/деактивирует форму добавления объявления
    setEnabled: function (enabled) {
      if (enabled) {
        formElement.classList.remove('ad-form--disabled');
      } else {
        resetForm();
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

  var resetForm = function () {
    var selectElements = formElement.querySelectorAll('select');
    var inputElements = formElement.querySelectorAll('input[type=text],input[type=number]');
    var checkboxElements = formElement.querySelectorAll('input[type=checkbox]');
    var imageElements = formElement.querySelectorAll('.ad-form__photo');

    avatarPreviewElement.src = 'img/muffin-grey.svg';

    selectElements.forEach(function (selectElement) {
      selectElement.selectedIndex = -1;
    });

    inputElements.forEach(function (inputElement) {
      inputElement.value = '';
    });

    checkboxElements.forEach(function (checkboxElement) {
      checkboxElement.checked = false;
    });

    imageElements.forEach(function (imageElement) {
      photoContainerElement.removeChild(imageElement);
    });

    window.map.resetMainPin();
  };

  var validateRoomsAndGuests = function () {
    if (roomsSelectElement.value !== guestsSelectElement.value) {
      roomsSelectElement.setCustomValidity('Количество комнат и гостей должно совпадать');
      return false;
    }

    roomsSelectElement.setCustomValidity('');
    return true;
  };

  var avatarSelectHandler = function () {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    var file = avatarInputElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var imagesSelectHandler = function () {
    var files = imagesInputElement.files;
    if (!files || !files.length) {
      return;
    }

    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();

      reader.addEventListener('load', function (evt) {
        var image = document.createElement('img');
        image.classList.add('ad-form__photo');
        image.src = evt.target.result;

        photoContainerElement.appendChild(image);
      });

      reader.readAsDataURL(files[i]);
    }
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

  var formResetHandler = function () {
    resetForm();
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
  resetButtonElement.addEventListener('click', formResetHandler);
  imagesInputElement.addEventListener('change', imagesSelectHandler);
  formElement.addEventListener('submit', formSubmitHandler);
})();
