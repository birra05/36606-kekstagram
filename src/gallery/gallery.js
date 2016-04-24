'use strict';

// var utilsModule = require('../utils');

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryList = document.querySelectorAll('.pictures img');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
var galleryComments = galleryContainer.querySelector('.comments-count');
var galleryLikes = galleryContainer.querySelector('.likes-count');
var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');
// var galleryPictures = [];
// var currentPicIndex = 0;

var showGallery = function() {
  galleryContainer.classList.remove('invisible');
};

var hideGallery = function() {
  galleryContainer.classList.add('invisible');
};

galleryClose.addEventListener('click', function(evt) {
  evt.preventDefault();
  hideGallery();
});

module.exports = {
  galleryList: galleryList,
  galleryImage: galleryImage,
  galleryComments: galleryComments,
  galleryLikes: galleryLikes,
  showGallery: showGallery
};
