'use strict';

var renderModule = require('./render');
var utilsModule = require('../base/utils');

// Обработчик события scroll у объекта window, который отображает следующую страницу
// с фотографиями при достижении низа страницы
var setScrollEnabled = function() {
  var pictures;
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    // Оптмимизация скролла
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      while(utilsModule.isBottomReached() && utilsModule.isNextPageAvailable(pictures, utilsModule.PAGE_NUMBER, utilsModule.PAGE_SIZE)) {
        renderModule.drawNextPages();
      }
    }, utilsModule.THROTTLE_TIMEOUT);
  });
};

module.exports = {
  setScrollEnabled: setScrollEnabled
};
