'use strict';

var renderFile = require('./render');
var utilsFile = require('../utils');

module.exports = {
  // Обработчик события scroll у объекта window, который отображает следующую страницу
  // с фотографиями по достижении низа страницы
  setScrollEnabled: function() {
    var pictures;
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      // Оптмимизация скролла
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        while(utilsFile.isBottomReached() && utilsFile.isNextPageAvailable(pictures, utilsFile.pageNumber, utilsFile.PAGE_SIZE)) {
          utilsFile.pageNumber++;
          renderFile.renderPictures(utilsFile.filteredPictures, utilsFile.pageNumber);
        }
      }, 100);
    });
  }
};
