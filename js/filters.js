'use strict';

(function () {
  var UPDATE_DELAY = 500;

  var MIDDLE_LOWEST_PRICE = 10000;
  var MIDDLE_HIGHEST_PRICE = 50000;
  var LOW_HIGHEST_PRICE = 10000;
  var HIGH_LOWEST_PRICE = 50000;

  var filtersElement = document.querySelector('.map__filters-container');
  var typeSelectElement = filtersElement.querySelector('select[name=housing-type]');
  var priceSelectElement = filtersElement.querySelector('select[name=housing-price]');
  var roomsSelectElement = filtersElement.querySelector('select[name=housing-rooms]');
  var guestsSelectElement = filtersElement.querySelector('select[name=housing-guests]');
  var featureCheckboxElements = filtersElement.querySelectorAll('input[name=features]');

  var getInitialFilters = function () {
    return {
      limit: 5,
      type: 'any',
      price: 'any',
      rooms: 'any',
      guests: 'any',
      features: {
        wifi: false,
        dishwasher: false,
        parking: false,
        washer: false,
        elevator: false,
        conditioner: false
      }
    };
  };

  var filters = getInitialFilters();

  window.filters = {
    setEnabled: function (enabled) {
      if (enabled) {
        filtersElement.style.display = 'block';
      } else {
        resetFilters();
        filtersElement.style.display = 'none';
      }

      filters = getInitialFilters();
    },
    apply: function (ads) {
      var filteredAds = ads.slice();

      // Фильтруем по типу жилья
      if (filters.type !== 'any') {
        filteredAds = filteredAds.filter(function (ad) {
          return ad.offer.type === filters.type;
        });
      }

      // Фильтр по стоимости
      if (filters.price !== 'any') {
        filteredAds = filteredAds.filter(function (ad) {
          switch (filters.price) {
            case 'middle':
              return (
                ad.offer.price >= MIDDLE_LOWEST_PRICE && ad.offer.price <= MIDDLE_HIGHEST_PRICE
              );
            case 'low':
              return ad.offer.price < LOW_HIGHEST_PRICE;
            case 'high':
              return ad.offer.price > HIGH_LOWEST_PRICE;
            default:
              return false;
          }
        });
      }

      // Фильтр по количеству комнат
      if (filters.rooms !== 'any') {
        filteredAds = filteredAds.filter(function (ad) {
          return ad.offer.rooms === parseInt(filters.rooms, window.shared.RADIX_DECIMAL);
        });
      }

      // Фильтр по количеству гостей
      if (filters.guests !== 'any') {
        filteredAds = filteredAds.filter(function (ad) {
          return ad.offer.guests === parseInt(filters.guests, window.shared.RADIX_DECIMAL);
        });
      }

      // Фильтр по фичам
      Object.keys(filters.features).forEach(function (key) {
        if (filters.features[key]) {
          filteredAds = filteredAds.filter(function (ad) {
            return ad.offer.features.includes(key);
          });
        }
      });

      // Ограничиваем количество
      if (filters.limit >= 0) {
        filteredAds = filteredAds.slice(0, filters.limit);
      }

      return filteredAds;
    }
  };

  var resetFilters = function () {
    typeSelectElement.selectedIndex = 0;
    priceSelectElement.selectedIndex = 0;
    roomsSelectElement.selectedIndex = 0;
    guestsSelectElement.selectedIndex = 0;

    featureCheckboxElements.forEach(function (featureElement) {
      featureElement.checked = false;
    });
  };

  var updatePins = window.utils.debounce(function () {
    window.map.updatePins();
  }, UPDATE_DELAY);

  var typeFilterChangeHandler = function (evt) {
    filters.type = evt.target.value;
    updatePins();
  };

  var priceFilterChangeHandler = function (evt) {
    filters.price = evt.target.value;
    updatePins();
  };

  var roomsFilterChangeHandler = function (evt) {
    filters.rooms = evt.target.value;
    updatePins();
  };

  var guestsFilterChangeHandler = function (evt) {
    filters.guests = evt.target.value;
    updatePins();
  };

  var featureFilterChangeHandler = function (evt) {
    filters.features[evt.target.value] = evt.target.checked;
    updatePins();
  };

  typeSelectElement.addEventListener('change', typeFilterChangeHandler);
  priceSelectElement.addEventListener('change', priceFilterChangeHandler);
  roomsSelectElement.addEventListener('change', roomsFilterChangeHandler);
  guestsSelectElement.addEventListener('change', guestsFilterChangeHandler);

  featureCheckboxElements.forEach(function (featureCheckboxElement) {
    featureCheckboxElement.addEventListener('change', featureFilterChangeHandler);
  });
})();
