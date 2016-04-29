'use strict';

var filtersModule = require('./filters');
var scrollModule = require('./scroll');
var utilsModule = require('../utils');

// Загружаем данные из файла по XMLHttpRequest
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    utilsModule.picturesContainer.classList.add('pictures-loading');
    callback(loadedData);
  };

  // Обработчики ошибки и таймаута
  xhr.onerror = function() {
    utilsModule.picturesContainer.classList.add('pictures-failure');
  };

  xhr.timeout = 5000;
  xhr.ontimeout = function() {
    utilsModule.picturesContainer.classList.add('pictures-failure');
  };

  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};

//Получение всего блока с фото
getPictures(function(loadedPictures) {
  utilsModule.pics = loadedPictures;

  filtersModule.setFiltrationEnabled();
  filtersModule.setFilterEnabled(filtersModule.currentFilter());
  scrollModule.setScrollEnabled();
  utilsModule.picturesContainer.classList.remove('pictures-loading');
});
