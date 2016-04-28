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

    galleryImage.addEventListener('click', this.onPhotoClick);

    this.galleryContainer.classList.remove('invisible');
    document.addEventListener('keydown', this.onDocumentKeyDown);
    this.galleryContainer.addEventListener('click', this.onContainerClick);
  };

  this.onPhotoClick = function() {
    if (this.currentPicIndex <= this.galleryPictures.length) {
      this.currentPicIndex++;
      this.showGalleryPic();
    } else {
      this.currentPicIndex = 0;
    }
  };

  galleryClose.addEventListener('click', function(evt) {
    evt.preventDefault();
    self.hideGallery();
  });

  this.onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      self.hideGallery();
    }
  };

  this.onContainerClick = function(evt) {
    if(evt.target.classList.contains('gallery-overlay')) {
      self.hideGallery();
    }
  };

  this.hideGallery = function() {
    this.galleryContainer.classList.add('invisible');

    // Удаление всех обработчиков событий
    galleryImage.removeEventListener('click', this.onPhotoClick);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    this.galleryContainer.removeEventListener('click', this.onContainerClick);
  };
};

module.exports = {
  Gallery: Gallery
};
