'use strict';

var utilsModule = require('../utils');

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
var galleryComments = galleryContainer.querySelector('.gallery-overlay-controls-comments');
var galleryLikes = galleryContainer.querySelector('.gallery-overlay-controls-like');
var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');
var galleryPictures = utilsModule.filteredPictures;
var currentPicIndex = 0;

var hideGallery = function() {
  galleryContainer.classList.add('invisible');
};

galleryClose.addEventListener('click', function(evt) {
  evt.preventDefault();
  hideGallery();
});

module.exports = {

  showGalleryPic: function() {
    galleryPictures.forEach(function() {
      var picture = new Image();
      galleryImage.appendChild(picture);
      galleryImage.src = galleryPictures[currentPicIndex].url;
      galleryComments.textContent = galleryPictures[currentPicIndex].comments;
      galleryLikes.textContent = galleryPictures[currentPicIndex].likes;
    });
  },

  showGallery: function(index) {
    currentPicIndex = index;
    galleryContainer.classList.remove('invisible');
    this.showGalleryPic();
  }
};
