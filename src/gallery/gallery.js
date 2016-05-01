'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  var galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  var galleryComments = this.galleryContainer.querySelector('.comments-count');
  var galleryLikes = this.galleryContainer.querySelector('.likes-count');
  var galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryPictures = [];
  this.currentPicIndex = 0;
  this.currentHash = location.hash;
  this.hashRegExp = new RegExp(/#photo\/(\S+)/);

  // Описываем фотографии и сохраняем их
  this.setGalleryPics = function(pictures) {
    this.galleryPictures = pictures;
    return this.galleryPictures;
  };

  // Показать картинку в галерее
  this.showGalleryPic = function(hash) {
    var currentPicture;

    if (hash) {
      currentPicture = this.galleryPictures.find(function(picture) {
        return hash.indexOf(picture.url) !== -1;
      });
      this.currentPicIndex = this.galleryPictures.indexOf(currentPicture);
      galleryImage.src = currentPicture;
      galleryComments.textContent = this.currentPicIndex.comments;
      galleryLikes.textContent = this.currentPicIndex.likes;
    } else {
      currentPicture = this.galleryPictures[this.currentPicIndex];
      galleryImage.src = currentPicture.url;
      galleryComments.textContent = currentPicture.comments;
      galleryLikes.textContent = currentPicture.likes;
    }
  };

  // Показать галерею
  this.showGallery = function(index, hash) {
    this.currentPicIndex = index;
    this.currentHash = hash;
    this.showGalleryPic(hash);

    galleryImage.addEventListener('click', this.onPhotoClick.bind(this));

    this.galleryContainer.classList.remove('invisible');

    galleryClose.addEventListener('click', this.OnCloseClick.bind(this));
    document.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
    this.galleryContainer.addEventListener('click', this.onContainerClick.bind(this));
  };

  // Показ следующей фотографии в списке
  this.onPhotoClick = function() {
    if (this.currentPicIndex <= this.galleryPictures.length) {
      this.currentPicIndex++;
      // this.showGalleryPic(this.currentHash);
      location.hash = this.galleryPictures[this.currentPicIndex].url;
    } else {
      this.currentPicIndex = 0;
    }
  };

  // Закрытие галереи
  this.OnCloseClick = function(evt) {
    evt.preventDefault();
    this.hideGallery();
  };

  // Закрытие галереи по нажатию ESC
  this.onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      this.hideGallery();
    }
  };

  // Закрытие галереи по нажатию на пустую область
  this.onContainerClick = function(evt) {
    if(evt.target.classList.contains('gallery-overlay')) {
      this.hideGallery();
    }
  };

  // Проверка хэша страницы
  this.onHashChange = function() {
    if(this.currentHash.match(this.hashRegExp)) {
      this.showGallery(this.currentHash);
    } else {
      this.hideGallery();
    }
  };

  // Закрытие галереи
  this.hideGallery = function() {
    this.galleryContainer.classList.add('invisible');

    // Удаление всех обработчиков событий
    galleryImage.removeEventListener('click', this.onPhotoClick.bind(this));

    galleryClose.removeEventListener('click', this.OnCloseClick.bind(this));
    document.removeEventListener('keydown', this.onDocumentKeyDown.bind(this));
    this.galleryContainer.removeEventListener('click', this.onContainerClick.bind(this));
    location.hash = '';
  };

  window.addEventListener('hashchange', this.onHashChange.bind(this));
};

module.exports = new Gallery();
