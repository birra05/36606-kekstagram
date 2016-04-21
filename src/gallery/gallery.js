'use strict';

// var utilsModule = require('../utils');

var galleryContainer = document.querySelector('.gallery-overlay');
// var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
// var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');

// var galleryPictures = [];

// var hideGallery = function() {
//   galleryContainer.classList.add('.invisible');
// };
//
// // hideGallery();

// Проверка вызова метода showGallery без параметров
module.exports = {
  showGallery: function() {
    // galleryPictures = pictures;
    // galleryPictures.forEach(function(pic) {
    //   var picture = new Image();
    //   galleryImage.appendChild(picture);
    //   picture.src = pic;
    // });
    galleryContainer.classList.remove('.invisible');
  }
};
