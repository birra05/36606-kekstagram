'use strict';

var utilsModule = require('../base/utils');
var BaseComponent = require('../base/base-component');

var Photo = function(data, container) {
  BaseComponent.call(this, this.element);
  this.data = data;
  this.container = container;
  this.createPictureElement();
  this.getPictureElement(data, container);
  this.onPhotoListClick = this.onPhotoListClick.bind(this);

  this.element.addEventListener('click', this.onPhotoListClick);
};

// Наследование от базового компонента
utilsModule.inherit(Photo, BaseComponent);

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

  // Наследование и перезапись метода, чтобы добавить контейнер для фото
  BaseComponent.prototype.add.call(this, container);
};

// Клик на фото открывает галерею с соответствующей фоткой
Photo.prototype.onPhotoListClick = function(evt) {
  evt.preventDefault();

  window.location.hash = 'photo/' + this.data.url;
};

// Удалить элементы после переключения фильтра или перезагрузки страницы, вызывается в модуле renderModule
Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoListClick);

  // Наследование и перезапись метода, чтобы удалить фото
  BaseComponent.prototype.remove.call(this, this.element);
};

module.exports = Photo;
