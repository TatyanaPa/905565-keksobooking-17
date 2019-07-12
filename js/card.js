'use strict';

(function () {
  // Создаёт и возвращает объект объявления на основе входных данных
  window.createAnnouncement = function (x, y, type, title, avatar) {
    return {
      location: {
        x: x + 'px',
        y: y + 'px'
      },
      offer: {
        type: type
      },
      author: {
        avatar: avatar,
        announcementTitle: title
      }
    };
  };
})();
// конец
