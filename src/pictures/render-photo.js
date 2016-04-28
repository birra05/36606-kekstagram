'use strict';

var Gallery = require('../gallery/gallery');
var utilsModule = require('../utils');

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
    image.width = utilsModule.IMAGE_SIZE;
    image.height = utilsModule.IMAGE_SIZE;
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

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureElement(data, container);
  this.onPhotoListClick = function(evt) {
    evt.preventDefault();
    if (evt.target.nodeName !== 'IMG') {
      return false;
    }
    var list = utilsModule.getFilteredPictures();
    var index = 0;
    for (var i = 0; i < list.length; i++) {
      if (data.url === list[i].url) {
        index = i;
      }
    }

    Gallery.showGallery(index);
    return true;
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onPhotoListClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPhotoListClick);
  container.appendChild(this.element);
};

module.exports = {
  getPictureElement: getPictureElement,
  Photo: Photo
};
