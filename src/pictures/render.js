'use strict';

var renderPhotoModule = require('./render-photo');
var utilsModule = require('../utils');

// Отрисовка картинки по скроллу или дорисовка на экране с широким разрешением
var drawNextPages = function() {
  utilsModule.pageNumber++;
  renderPictures(utilsModule.filteredPictures, utilsModule.pageNumber);
};

// Отрисовка всех картинок
var renderPictures = function(pictures, page, replace) {
  if(replace) {
    utilsModule.pageNumber = 0;
    utilsModule.renderedPictures.forEach(function(picture) {
      picture.remove();
    });

    utilsModule.renderedPictures = [];
  }

  var from = page * utilsModule.PAGE_SIZE;
  var to = from + utilsModule.PAGE_SIZE;

  var container = document.createDocumentFragment();

  pictures.slice(from, to).forEach(function(picture) {
    utilsModule.renderedPictures.push(new renderPhotoModule.Photo(picture, container));
  });

  utilsModule.picturesContainer.appendChild(container);

  // Отрисовать все фото на экране с большим разрешением
  var picturesContainerHeight = parseFloat(getComputedStyle(utilsModule.picturesContainer).height);

  var blockIsNotFull = function() {
    return window.innerHeight - picturesContainerHeight > 0;
  };

  var renderNextPages = function() {
    while (blockIsNotFull() && utilsModule.isNextPageAvailable(pictures, utilsModule.pageNumber, utilsModule.PAGE_SIZE)) {
      drawNextPages();
    }
  };

  renderNextPages();
};

module.exports = {
  drawNextPages: drawNextPages,
  renderPictures: renderPictures
};
