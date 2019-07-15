'use strict';

(function () {
  var mainElement = document.querySelector('main');

  var createXMLHttpRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.xhr = {
    load: function (url, onSuccess, onError) {
      var xhr = createXMLHttpRequest(onSuccess, onError);
      xhr.open('GET', url);
      xhr.send();
    },
    send: function (url, body, onSuccess, onError) {
      var xhr = createXMLHttpRequest(onSuccess, onError);
      xhr.open('POST', url);
      xhr.send(body);
    },
    showErrorMessage: function (message, onRetry) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorMessageElement = errorElement.querySelector('.error__message');
      var errorRetryButton = errorElement.querySelector('.error__button');

      var closeErrorMessage = function () {
        mainElement.removeChild(errorElement);
      };

      var errorClickHandler = function () {
        closeErrorMessage();
      };

      var errorKeyDownHandler = function (evt) {
        if (evt.keyCode === 27) {
          document.removeEventListener('keydown', errorKeyDownHandler);
          closeErrorMessage();
        }
      };

      var errorRetryButtonClickHandler = function (evt) {
        evt.stopPropagation();

        if (onRetry && typeof onRetry === 'function') {
          closeErrorMessage();
          onRetry();
        }
      };

      document.addEventListener('keydown', errorKeyDownHandler);
      errorElement.addEventListener('click', errorClickHandler);
      errorRetryButton.addEventListener('click', errorRetryButtonClickHandler);

      errorMessageElement.textContent = message;

      mainElement.appendChild(errorElement);
    },
    showSuccessMessage: function (message) {
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var successElement = successTemplate.cloneNode(true);
      var successMessageElement = successElement.querySelector('.success__message');

      var closeSuccessMessage = function () {
        mainElement.removeChild(successElement);
      };

      var successClickHandler = function () {
        closeSuccessMessage();
      };

      var successKeyDownHandler = function (evt) {
        if (evt.keyCode === 27) {
          document.removeEventListener('keydown', successKeyDownHandler);
          closeSuccessMessage();
        }
      };

      document.addEventListener('keydown', successKeyDownHandler);
      successElement.addEventListener('click', successClickHandler);

      successMessageElement.textContent = message;

      mainElement.appendChild(successElement);
    }
  };
})();
// конец
