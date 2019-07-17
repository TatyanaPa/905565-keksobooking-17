'use strict';

(function () {
  var MinPricesPerNight = {
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

      var fieldsetElements = formElement.querySelectorAll('fieldset');
      fieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = !enabled;
      });
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

      Object.keys(selectOptions).forEach(function (option) {
        if (selectOptions[option].value === value) {
          selectOptions[option].selected = true;
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

    avatarPreviewElement.src = 'img/muffin-grey.svg';

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
      photoContainerElement.removeChild(imageElement);
    });

    descriptionElement.value = '';

    window.map.resetMainPin();
  };

  var validateRoomsAndGuests = function () {
    var rooms = roomsSelectElement.value;
    var guests = guestsSelectElement.value;

    if (rooms === 0 && guests !== 0) {
      roomsSelectElement.setCustomValidity('Помещение слишком большое для гостей');
      return false;
    }

    if (rooms < guests) {
      roomsSelectElement.setCustomValidity(
          'Количество комнат должно быть больше или равно количествую гостей'
      );
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

    files.forEach(function (file) {
      var reader = new FileReader();

      reader.addEventListener('load', function (evt) {
        var image = document.createElement('img');
        image.classList.add('ad-form__photo');
        image.src = evt.target.result;

        photoContainerElement.appendChild(image);
      });

      reader.readAsDataURL(file);
    });
  };

  var typeSelectChangeHandler = function (evt) {
    var priceInput = formElement.querySelector('input[name=price]');

    var offerType = evt.target.value;
    var minPricePerNight = MinPricesPerNight[offerType];

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
  resetButtonElement.addEventListener('click', formResetHandler);
  imagesInputElement.addEventListener('change', imagesSelectHandler);
  formElement.addEventListener('submit', formSubmitHandler);
})();
