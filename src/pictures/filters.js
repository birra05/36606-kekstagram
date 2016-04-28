'use strict';

var renderModule = require('./render');
var utilsModule = require('../utils');
var Gallery = require('../gallery/gallery');

var filters = document.querySelector('.filters');

var filterType = {
  POPULAR: 'filter-popular',
  NEW: 'filter-new',
  DISCUSSED: 'filter-discussed'
};

var DEFAULT_FILTER = filterType.POPULAR;

// Убираем атрибут checked с фильтров. Вызывается сразу после объявления, чтобы при перезагрузке страницы фильтр не мигал
// Знаю, что кривота дикая
var removeFiltersCheckedAttr = function() {
  for(var i = 0; i < filters.length; i++) {
    filters[i].removeAttribute('checked');
  }
};

removeFiltersCheckedAttr();

// Спрятать блок с фильтрами
filters.classList.add('hidden');

var getFilteredPictures = function(pictures, filter) {
  var picturesToFilter = pictures.slice(0);

  switch(filter) {
    case filterType.POPULAR:
      break;
    // Фильтр Новые — список фотографий, сделанных за последние две недели, отсортированные по убыванию даты (поле date)
    case filterType.NEW:
      picturesToFilter = picturesToFilter.filter(function(elem) {
        var dateTwoWeeksAgo = new Date(elem.date);
        var nowDate = new Date();
        return dateTwoWeeksAgo > nowDate - 14 * 24 * 60 * 60 * 1000;
      });
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      break;
    // Фильтр Обсуждаемые — отсортированные по убыванию количества комментариев (поле comments)
    case filterType.DISCUSSED:
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return picturesToFilter;
};

// Последний примененный фильтр сохраняется в localStorage
var setFilterInLocalStorage = function(filter) {
  localStorage.setItem('filter', filter);
};

// Получаем последний примененный фильтр
var getFilterFromLocalStorage = function() {
  return localStorage.getItem('filter');
};

// Указываем последний примененный фильтр по умолчанию
var currentFilter = function() {
  if(localStorage.hasOwnProperty('filter')) {
    filters.querySelector('#' + getFilterFromLocalStorage()).setAttribute('checked', true);
    return getFilterFromLocalStorage();
  } else {
    filters.querySelector('#' + DEFAULT_FILTER).setAttribute('checked', true);
    return DEFAULT_FILTER;
  }
};

var setFilterEnabled = function(filter) {
  utilsModule.filteredPictures = getFilteredPictures(utilsModule.pics, filter);
  Gallery.setGalleryPics(utilsModule.filteredPictures);
  utilsModule.pageNumber = 0;
  renderModule.renderPictures(utilsModule.filteredPictures, utilsModule.pageNumber, true);
};

// После загрузки всех данных показать блок с фильтрами
filters.classList.remove('hidden');

module.exports = {
  currentFilter: currentFilter,
  setFilterEnabled: setFilterEnabled,

  setFiltrationEnabled: function() {
    // Делегирование
    filters.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('filters-radio')) {
        setFilterEnabled(evt.target.id);
        setFilterInLocalStorage(evt.target.id);
      }
    });
  }
};
