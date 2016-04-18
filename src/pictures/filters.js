'use strict';

var picturesFile = require('./pictures');

var filters = document.querySelector('.filters');

// Спрятать блок с фильтрами
filters.classList.add('hidden');

// Фильтрация
var getFilteredPictures = function(pictures, filter) {
  var picturesToFilter = pictures.slice(0);

  switch(filter) {
    case 'filter-popular':
      break;
    // Фильтр Новые — список фотографий, сделанных за последние две недели, отсортированные по убыванию даты (поле date)
    case 'filter-new':
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
    case 'filter-discussed':
      picturesToFilter = picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return picturesToFilter;
};

var setFilterEnabled = function(filter, loadedPictures) {
  picturesFile.filteredPictures = getFilteredPictures(loadedPictures, filter);
  picturesFile.pageNumber = 0;
  picturesFile.renderPictures(picturesFile.filteredPictures, picturesFile.pageNumber, true);
};

module.exports = {
  filters: document.querySelector('.filters'),

  setFilterEnabled: function(filter) {
    picturesFile.filteredPictures = getFilteredPictures(picturesFile.pics, filter);
    picturesFile.pageNumber = 0;
    picturesFile.renderPictures(picturesFile.filteredPictures, picturesFile.pageNumber, true);
  },

  setFiltrationEnabled: function() {
    // Делегирование
    filters.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('filters-radio')) {
        setFilterEnabled(evt.target.id);
      }
    });
  }
};
