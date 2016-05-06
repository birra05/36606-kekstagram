'use strict';

var Photo = require('./photo');
var Gallery = require('../gallery/gallery');
var utilsModule = require('../base/utils');

// Отрисовка картинки по скроллу или дорисовка на экране с широким разрешением
var drawNextPages = function() {
  utilsModule.PAGE_NUMBER++;
  renderPictures(utilsModule.filteredPictures, utilsModule.PAGE_NUMBER);
};

// Отрисовка всех картинок
var renderPictures = function(pictures, page, replace) {
  if(replace) {
    utilsModule.PAGE_NUMBER = 0;
    utilsModule.renderedPictures.forEach(function(picture) {
      picture.remove();
    });

    utilsModule.renderedPictures = [];
  }

  var from = page * utilsModule.PAGE_SIZE;
  var to = from + utilsModule.PAGE_SIZE;

  var container = document.createDocumentFragment();

  pictures.slice(from, to).forEach(function(picture) {
    utilsModule.renderedPictures.push(new Photo(picture, container));
  });

  utilsModule.picturesContainer.appendChild(container);

  // Проверка состояния строки
  Gallery.onHashChange();

  // Отрисовать все фото на экране с большим разрешением
  var picturesContainerHeight = parseFloat(getComputedStyle(utilsModule.picturesContainer).height);

  var blockIsNotFull = function() {
    return window.innerHeight - picturesContainerHeight > 0;
  };

  var renderNextPages = function() {
    while (blockIsNotFull() && utilsModule.isNextPageAvailable(pictures, utilsModule.PAGE_NUMBER, utilsModule.PAGE_SIZE)) {
      drawNextPages();
    }
  };

  renderNextPages();
};

module.exports = {
  drawNextPages: drawNextPages,
  renderPictures: renderPictures
};
