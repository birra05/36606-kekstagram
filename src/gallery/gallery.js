'use strict';

var Gallery = function() {
  var self = this;

  this.galleryContainer = document.querySelector('.gallery-overlay');
  var galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  var galleryComments = this.galleryContainer.querySelector('.comments-count');
  var galleryLikes = this.galleryContainer.querySelector('.likes-count');
  var galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryPictures = [];
  this.currentPicIndex = 0;

  // Описываем фотографии и сохраняем их
  this.setGalleryPics = function(pictures) {
    self.galleryPictures = pictures;
    return self.galleryPictures;
  };

  // Показать картинку в галерее
  this.showGalleryPic = function(hash) {
    var currentPicture = self.galleryPictures[self.currentPicIndex];

    if (hash) {
      currentPicture = self.galleryPictures.find(function(picture) {
        return hash.indexOf(picture.url) !== -1;
      });
    } else {
      currentPicture = self.galleryPictures[this.currentPicIndex];
    }

    self.currentPicIndex = self.galleryPictures.indexOf(currentPicture);
    galleryImage.src = currentPicture.url;
    galleryComments.textContent = currentPicture.comments;
    galleryLikes.textContent = currentPicture.likes;
  };

  // Показать галерею
  this.showGallery = function(hash) {
    this.showGalleryPic(hash);

    galleryImage.addEventListener('click', this.onPhotoClick);

    self.galleryContainer.classList.remove('invisible');

    galleryClose.addEventListener('click', this.OnCloseClick);
    document.addEventListener('keydown', this.onDocumentKeyDown);
    self.galleryContainer.addEventListener('click', this.onContainerClick);
  };

  // Показ следующей фотографии в списке
  this.onPhotoClick = function() {
    if (self.currentPicIndex <= self.galleryPictures.length) {
      self.currentPicIndex++;
      window.location.hash = 'photo/' + self.galleryPictures[self.currentPicIndex].url;
    } else {
      self.currentPicIndex = 0;
    }
  };

  // Закрытие галереи
  this.OnCloseClick = function(evt) {
    evt.preventDefault();
    self.hideGallery();
  };

  // Закрытие галереи по нажатию ESC
  this.onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      self.hideGallery();
    }
  };

  // Закрытие галереи по нажатию на пустую область
  this.onContainerClick = function(evt) {
    if(evt.target.classList.contains('gallery-overlay')) {
      self.hideGallery();
    }
  };

  // Проверка хэша страницы
  this.onHashChange = function() {
    self.currentHash = window.location.hash;
    self.hashRegExp = new RegExp(/#photo\/(\S+)/);
    if(self.currentHash.match(self.hashRegExp)) {
      self.showGallery();
    } else {
      self.hideGallery();
    }
  };

  // Закрытие галереи
  this.hideGallery = function() {
    self.galleryContainer.classList.add('invisible');

    // Удаление всех обработчиков событий
    galleryImage.removeEventListener('click', this.onPhotoClick);

    galleryClose.removeEventListener('click', this.OnCloseClick);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    self.galleryContainer.removeEventListener('click', this.onContainerClick);
    // window.removeEventListener('hashchange', this.onHashChange);
    window.location.hash = '';
  };

  window.addEventListener('hashchange', this.onHashChange);
};

module.exports = new Gallery();
