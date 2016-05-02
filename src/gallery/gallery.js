'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.galleryComments = this.galleryContainer.querySelector('.comments-count');
  this.galleryLikes = this.galleryContainer.querySelector('.likes-count');
  this.galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryPictures = [];
  this.currentPicIndex = 0;

  // Привязка методов
  this.onPhotoClick = this.onPhotoClick.bind(this);
  this.OnCloseClick = this.OnCloseClick.bind(this);
  this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  this.onContainerClick = this.onContainerClick.bind(this);

  window.addEventListener('hashchange', this.onHashChange.bind(this));
};

// Описываем фотографии и сохраняем их
Gallery.prototype.setGalleryPics = function(pictures) {
  this.galleryPictures = pictures;
  return this.galleryPictures;
};

// Показать картинку в галерее
Gallery.prototype.showGalleryPic = function(hash) {
  var currentPicture = this.galleryPictures[this.currentPicIndex];

  if (hash) {
    currentPicture = this.galleryPictures.find(function(picture) {
      return hash.indexOf(picture.url) !== -1;
    });
  } else {
    currentPicture = this.galleryPictures[this.currentPicIndex];
  }

  this.currentPicIndex = this.galleryPictures.indexOf(currentPicture);
  this.galleryImage.src = currentPicture.url;
  this.galleryComments.textContent = currentPicture.comments;
  this.galleryLikes.textContent = currentPicture.likes;
};

// Показать галерею
Gallery.prototype.showGallery = function(hash) {
  this.showGalleryPic(hash);

  this.galleryImage.addEventListener('click', this.onPhotoClick);

  this.galleryContainer.classList.remove('invisible');

  this.galleryClose.addEventListener('click', this.OnCloseClick);
  document.addEventListener('keydown', this.onDocumentKeyDown);
  this.galleryContainer.addEventListener('click', this.onContainerClick);
};

// Показ следующей фотографии в списке
Gallery.prototype.onPhotoClick = function() {
  if (this.currentPicIndex <= this.galleryPictures.length) {
    this.currentPicIndex++;
    window.location.hash = 'photo/' + this.galleryPictures[this.currentPicIndex].url;
  } else {
    this.currentPicIndex = 0;
  }
};

// Закрытие галереи
Gallery.prototype.OnCloseClick = function(evt) {
  evt.preventDefault();
  this.hideGallery();
};

// Закрытие галереи по нажатию ESC
Gallery.prototype.onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27) {
    this.hideGallery();
  }
};

// Закрытие галереи по нажатию на пустую область
Gallery.prototype.onContainerClick = function(evt) {
  if(evt.target.classList.contains('gallery-overlay')) {
    this.hideGallery();
  }
};

// Проверка хэша страницы
Gallery.prototype.onHashChange = function() {
  this.currentHash = window.location.hash;
  this.hashRegExp = new RegExp(/#photo\/(\S+)/);
  if(this.currentHash.match(this.hashRegExp)) {
    this.showGallery();
  } else {
    this.hideGallery();
  }
};

// Закрытие галереи
Gallery.prototype.hideGallery = function() {
  this.galleryContainer.classList.add('invisible');

  // Удаление всех обработчиков событий
  this.galleryImage.removeEventListener('click', this.onPhotoClick);

  this.galleryClose.removeEventListener('click', this.OnCloseClick);
  document.removeEventListener('keydown', this.onDocumentKeyDown);
  this.galleryContainer.removeEventListener('click', this.onContainerClick);
  window.location.hash = '';
};

module.exports = new Gallery();
