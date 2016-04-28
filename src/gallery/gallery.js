'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryImage = galleryContainer.querySelector('.gallery-overlay-image');
var galleryComments = galleryContainer.querySelector('.comments-count');
var galleryLikes = galleryContainer.querySelector('.likes-count');
var galleryClose = galleryContainer.querySelector('.gallery-overlay-close');
var galleryPictures = [];
var currentPicIndex = 0;

// Функция, принимающая на вход массив объектов, описывающих фотографии, и сохраняющая их
var setGalleryPics = function(pictures) {
  galleryPictures = pictures;
  return galleryPictures;
};

// Показать фото в галерее
var showGalleryPic = function() {
  var currentPicture = galleryPictures[currentPicIndex];
  galleryImage.src = currentPicture.url;
  galleryComments.textContent = currentPicture.comments;
  galleryLikes.textContent = currentPicture.likes;
};

// Показать галерею
var showGallery = function(index) {
  currentPicIndex = index;
  showGalleryPic();

  galleryImage.addEventListener('click', onPhotoClick);

  galleryContainer.classList.remove('invisible');
  document.addEventListener('keydown', onDocumentKeyDown);
  galleryContainer.addEventListener('click', onContainerClick);
};

// Обработчик события клика по фотографии onPhotoClick, показывает следующую фотографию
var onPhotoClick = function() {
  if (currentPicIndex <= galleryPictures.length) {
    currentPicIndex++;
    showGalleryPic();
  } else {
    currentPicIndex = 0;
  }
};

// Скрыть галерею и удалить обработчики событий
var hideGallery = function() {
  galleryContainer.classList.add('invisible');

  // Удаление всех обработчиков событий
  galleryImage.removeEventListener('click', onPhotoClick);
  document.removeEventListener('keydown', onDocumentKeyDown);
  galleryContainer.removeEventListener('click', onContainerClick);
};

galleryClose.addEventListener('click', function(evt) {
  evt.preventDefault();
  hideGallery();
});

// Закрытие галереи по нажатию ESC - НЕ РАБОТАЕТ! :(
var onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27) {
    hideGallery();
  }
};

// Закрытие галереи по нажатию на пустую область вокруг контейнера
var onContainerClick = function(evt) {
  if(evt.target.classList.contains('gallery-overlay')) {
    hideGallery();
  }
};

module.exports = {
  showGallery: showGallery,
  setGalleryPics: setGalleryPics
};
