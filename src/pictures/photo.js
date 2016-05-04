'use strict';

var utilsModule = require('../utils');

var Photo = function(data, container) {
  this.data = data;
  this.container = container;
  this.createPictureElement();
  this.getPictureElement(data, container);
  this.onPhotoListClick = this.onPhotoListClick.bind(this);

  this.element.addEventListener('click', this.onPhotoListClick);
};

// Создаем обертку, в которой будет находиться каждое фото
Photo.prototype.createPictureElement = function() {
  var elementToClone;
  this.templateElement = document.querySelector('#picture-template');

  if ('content' in this.templateElement) {
    elementToClone = this.templateElement.content.querySelector('.picture');
  } else {
    elementToClone = this.templateElement.querySelector('.picture');
  }

  this.element = elementToClone.cloneNode(true);
};

// Заполняем каждый элемент картинкой с комментариями и лайками
Photo.prototype.getPictureElement = function(data, container) {
  this.element.querySelector('.picture-comments').textContent = data.comments;
  this.element.querySelector('.picture-likes').textContent = data.likes;

  // Создаем изображения
  var image = this.element.querySelector('img');
  var pictureImage = new Image(utilsModule.IMAGE_SIZE, utilsModule.IMAGE_SIZE);

  // Обработчик загрузки
  pictureImage.onload = function() {
    // Отмена таймаута
    clearTimeout(imageLoadTimeout);
    image.src = data.url;
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
  }, utilsModule.IMAGE_LOAD_TIMEOUT);

  container.appendChild(this.element);
  return this.element;
};

// Клик на фото открывает галерею с соответствующей фоткой
Photo.prototype.onPhotoListClick = function(evt) {
  evt.preventDefault();
  if (evt.target.nodeName !== 'IMG') {
    return false;
  }
  var list = utilsModule.getFilteredPictures();
  var index = 0;
  for (var i = 0; i < list.length; i++) {
    if (this.data.url === list[i].url) {
      index = i;
    }
  }

  window.location.hash = 'photo/' + list[index].url;
  return true;
};

// Удалить элементы после переключения фильтра или перезагрузки страницы, вызывается в модуле renderModule
Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoListClick);
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
