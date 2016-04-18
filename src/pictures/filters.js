'use strict';

require('./pictures');

var filters = document.querySelector('.filters');
module.exports = filters;

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

module.exports = {

  setFilterEnabled: function(filter) {
    filteredPictures = getFilteredPictures(pics, filter);
    pageNumber = 0;
    renderPictures(filteredPictures, pageNumber, true);
  },

  setFiltrationEnabled: function() {
    // Делегирование
    filters.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('filters-radio')) {
        module.exports.setFilterEnabled(evt.target.id);
      }
    });
  }
};

// var setFilterEnabled = function(filter) {
//   filteredPictures = getFilteredPictures(pics, filter);
//   pageNumber = 0;
//   renderPictures(filteredPictures, pageNumber, true);
// };

// var setFiltrationEnabled = function() {
//   // Делегирование
//   filters.addEventListener('click', function(evt) {
//     if (evt.target.classList.contains('filters-radio')) {
//       setFilterEnabled(evt.target.id);
//     }
//   });
// };
