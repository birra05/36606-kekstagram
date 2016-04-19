'use strict';

var utilsFile = require('../utils');

var elementToClone;
var templateElement = document.querySelector('#picture-template');

// Для IE
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

// Создаем блок фотографии на основе шаблона
var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  // Создаем изображения
  var image = element.querySelector('img');

  var pictureImage = new Image();

  // Обработчик загрузки
  pictureImage.onload = function() {
    // Отмена таймаута
    clearTimeout(imageLoadTimeout);
    image.src = data.url;
    image.width = '182';
    image.height = '182';
    image.alt = data.date;
  };

  // Обработчик ошибки
  pictureImage.onerror = function() {
    image.classList.add('picture-load-failure');
  };

  pictureImage.src = data.url;

  // Таймаут
  var imageLoadTimeout = setTimeout(function() {
    image.src = '';
    image.classList.add('picture-load-failure');
  }, 5000);

  container.appendChild(element);
  return element;
};

// Отрисовка каждой картинки
var renderPictures = function(pictures, page, replace) {
  if(replace) {
    utilsFile.picturesContainer.innerHTML = '';
  }

  var from = page * utilsFile.PAGE_SIZE;
  var to = from + utilsFile.PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, utilsFile.picturesContainer);
  });

  // Отрисовать все фото на экране с большим разрешением
  var picturesContainerHeight = parseFloat(getComputedStyle(utilsFile.picturesContainer).height);

  var blockIsNotFull = function() {
    return window.innerHeight - picturesContainerHeight > 0;
  };

  var renderNextPages = function() {
    while (blockIsNotFull() && utilsFile.isNextPageAvailable(pictures, utilsFile.pageNumber, utilsFile.PAGE_SIZE)) {
      utilsFile.pageNumber++;
      renderPictures(utilsFile.filteredPictures, utilsFile.pageNumber);
    }
  };

  renderNextPages();
};

module.exports = {

  // Отрисовка каждой картинки
  renderPictures: function(pictures, page, replace) {
    if(replace) {
      utilsFile.picturesContainer.innerHTML = '';
    }

    var from = page * utilsFile.PAGE_SIZE;
    var to = from + utilsFile.PAGE_SIZE;

    pictures.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, utilsFile.picturesContainer);
    });

    // Отрисовать все фото на экране с большим разрешением
    var picturesContainerHeight = parseFloat(getComputedStyle(utilsFile.picturesContainer).height);

    var blockIsNotFull = function() {
      return window.innerHeight - picturesContainerHeight > 0;
    };

    var renderNextPages = function() {
      while (blockIsNotFull() && utilsFile.isNextPageAvailable(pictures, utilsFile.pageNumber, utilsFile.PAGE_SIZE)) {
        utilsFile.pageNumber++;
        renderPictures(utilsFile.filteredPictures, utilsFile.pageNumber);
      }
    };

    renderNextPages();
  }
};
