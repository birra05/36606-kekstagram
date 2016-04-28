'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  var galleryImage = this.galleryContainer.querySelector('.gallery-overlay-image');
  var galleryComments = this.galleryContainer.querySelector('.comments-count');
  var galleryLikes = this.galleryContainer.querySelector('.likes-count');
  var galleryClose = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.galleryPictures = [];
  this.currentPicIndex = 0;

  this.setGalleryPics = function(pictures) {
    this.galleryPictures = pictures;
    return this.galleryPictures;
  };

  this.showGalleryPic = function() {
    var currentPicture = this.galleryPictures[this.currentPicIndex];
    galleryImage.src = currentPicture.url;
    galleryComments.textContent = currentPicture.comments;
    galleryLikes.textContent = currentPicture.likes;
  };

  this.showGallery = function(index) {
    this.currentPicIndex = index;
    this.showGalleryPic();

    galleryImage.addEventListener('click', this.onPhotoClick.bind(this));

    this.galleryContainer.classList.remove('invisible');

    galleryClose.addEventListener('click', this.OnCloseClick.bind(this));
    document.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
    this.galleryContainer.addEventListener('click', this.onContainerClick.bind(this));
  };

  this.onPhotoClick = function() {
    if (this.currentPicIndex <= this.galleryPictures.length) {
      this.currentPicIndex++;
      this.showGalleryPic();
    } else {
      this.currentPicIndex = 0;
    }
  };

  this.OnCloseClick = function(evt) {
    evt.preventDefault();
    this.hideGallery();
  };

  this.onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      this.hideGallery();
    }
  };

  this.onContainerClick = function(evt) {
    if(evt.target.classList.contains('gallery-overlay')) {
      this.hideGallery();
    }
  };

  this.hideGallery = function() {
    this.galleryContainer.classList.add('invisible');

    // Удаление всех обработчиков событий
    galleryImage.removeEventListener('click', this.onPhotoClick.bind(this));

    galleryClose.removeEventListener('click', this.OnCloseClick.bind(this));
    document.removeEventListener('keydown', this.onDocumentKeyDown.bind(this));
    this.galleryContainer.removeEventListener('click', this.onContainerClick.bind(this));
  };
};

module.exports = new Gallery();
