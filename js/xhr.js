'use strict';

(function () {
  var TIMEOUT = 10000;
  var HTTP_SUCCESS_STATUS = 200;

  var mainElement = document.querySelector('main');

  var createXMLHttpRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_SUCCESS_STATUS) {
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
      var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplateElement.cloneNode(true);
      var errorMessageElement = errorElement.querySelector('.error__message');
      var errorRetryButtonElement = errorElement.querySelector('.error__button');

      var closeErrorMessage = function () {
        mainElement.removeChild(errorElement);
      };

      var errorClickHandler = function () {
        closeErrorMessage();
      };

      var errorKeyDownHandler = function (evt) {
        if (evt.keyCode === window.shared.ESCAPE_KEY_CODE) {
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
      errorRetryButtonElement.addEventListener('click', errorRetryButtonClickHandler);

      errorMessageElement.textContent = message;

      mainElement.appendChild(errorElement);
    },
    showSuccessMessage: function (message) {
      var successTemplateElement = document
        .querySelector('#success')
        .content.querySelector('.success');
      var successElement = successTemplateElement.cloneNode(true);
      var successMessageElement = successElement.querySelector('.success__message');

      var closeSuccessMessage = function () {
        mainElement.removeChild(successElement);

        document.removeEventListener('keydown', successKeyDownHandler);
        successElement.removeEventListener('click', successClickHandler);
      };

      var successClickHandler = function () {
        closeSuccessMessage();
      };

      var successKeyDownHandler = function (evt) {
        if (evt.keyCode === window.shared.ESCAPE_KEY_CODE) {
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
