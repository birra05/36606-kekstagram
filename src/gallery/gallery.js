'use strict';

// var utilsModule = require('../utils');

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
// var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');

var galleryPictures = [];

var hideGallery = function() {
  galleryContainer.classList.add('.invisible');
};

hideGallery();

module.exports = {
  showGallery: function(pictures) {
    galleryPictures = pictures;
    galleryPictures.forEach(function(pic) {
      var preview = new Image();
      galleryImage.appendChild(preview);
      preview.src = pic;
    });
    galleryContainer.classList.remove('.invisible');
  }
};
