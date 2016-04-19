'use strict';

var filtersFile = require('./filters');
var scrollFile = require('./scroll');
var utilsFile = require('../utils');

// Загружаем данные из файла по XMLHttpRequest
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    utilsFile.picturesContainer.classList.add('pictures-loading');
    callback(loadedData);
  };

  // Обработчики ошибки и таймаута
  xhr.onerror = function() {
    utilsFile.picturesContainer.classList.add('pictures-failure');
  };

  xhr.timeout = 5000;
  xhr.ontimeout = function() {
    utilsFile.picturesContainer.classList.add('pictures-failure');
  };

  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};

//Получение всего блока с фото
getPictures(function(loadedPictures) {
  utilsFile.pics = loadedPictures;

  filtersFile.setFiltrationEnabled();
  filtersFile.setFilterEnabled('filter-popular');
  scrollFile.setScrollEnabled();
  utilsFile.picturesContainer.classList.remove('pictures-loading');
});
