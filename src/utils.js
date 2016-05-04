'use strict';

// Общие переменные и конструкторы

// Для Resizer
/**
 * Вспомогательный тип, описывающий квадрат.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} side
 * @private
 */
var Square = function(x, y, side) {
  this.x = x;
  this.y = y;
  this.side = side;
};

/**
 * Вспомогательный тип, описывающий координату.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @private
 */
var Coordinate = function(x, y) {
  this.x = x;
  this.y = y;
};

// Для модулей в папке upload
/**
 * Ставит одну из трех случайных картинок на фон формы загрузки.
 */
var updateBackground = function() {
  var images = [
    'img/logo-background-1.jpg',
    'img/logo-background-2.jpg',
    'img/logo-background-3.jpg'
  ];

  var backgroundElement = document.querySelector('.upload');
  var randomImageNumber = Math.round(Math.random() * (images.length - 1));
  backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
};

// Определяем срок хранения куки фильтра
var setCookiesDate = function() {
  // Cookies
  var nowDate = new Date();
  // День рождения - 5 ноября
  var birthDate = new Date(nowDate.getFullYear(), 10, 5);
  var lastBirthDate;
  var dateToExpire;
  var formattedDateToExpire;

  if(nowDate - birthDate >= 0) {
    lastBirthDate = new Date(nowDate.getFullYear(), 10, 5);
    dateToExpire = Date.now() + (nowDate - lastBirthDate);
    formattedDateToExpire = new Date(dateToExpire).toUTCString();
  } else {
    lastBirthDate = new Date(nowDate.getFullYear() - 1, 10, 5);
    dateToExpire = Date.now() + (nowDate - lastBirthDate);
    formattedDateToExpire = new Date(dateToExpire).toUTCString();
  }

  return formattedDateToExpire;
};

// Для модулей в папке pictures
var picturesContainer = document.querySelector('.pictures');
var containerSides = picturesContainer.getBoundingClientRect();

var pics = [];
var renderedPictures = [];
var filteredPictures = [];

// Константы
var IMAGE_SIZE = 182;
var PAGE_NUMBER = 0;
var PAGE_SIZE = 12;
var IMAGE_LOAD_TIMEOUT = 5000;
var THROTTLE_TIMEOUT = 100;

// Вспомогательные функции
var showElement = function(element) {
  element.classList.remove('invisible');
};

var hideElement = function(element) {
  element.classList.add('invisible');
};

var isBottomReached = function() {
  return containerSides.top - window.innerHeight <= 0;
};

var isNextPageAvailable = function(pictures, page, pageSize) {
  return page < Math.floor(this.filteredPictures.length / pageSize);
};

var getFilteredPictures = function() {
  return this.filteredPictures;
};

module.exports = {
  Square: Square,
  Coordinate: Coordinate,
  picturesContainer: picturesContainer,
  pics: pics,
  renderedPictures: renderedPictures,
  filteredPictures: filteredPictures,
  IMAGE_SIZE: IMAGE_SIZE,
  PAGE_NUMBER: PAGE_NUMBER,
  PAGE_SIZE: PAGE_SIZE,
  IMAGE_LOAD_TIMEOUT: IMAGE_LOAD_TIMEOUT,
  THROTTLE_TIMEOUT: THROTTLE_TIMEOUT,

  updateBackground: updateBackground,
  showElement: showElement,
  hideElement: hideElement,
  setCookiesDate: setCookiesDate,

  isBottomReached: isBottomReached,
  isNextPageAvailable: isNextPageAvailable,
  getFilteredPictures: getFilteredPictures
};
