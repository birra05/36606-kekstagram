'use strict';

var picturesContainer = document.querySelector('.pictures');
var containerSides = picturesContainer.getBoundingClientRect();

// Общие переменные
module.exports = {
  picturesContainer: document.querySelector('.pictures'),
  pics: [],
  filteredPictures: [],
  pageNumber: 0,
  PAGE_SIZE: 12,

  isBottomReached: function() {
    return containerSides.top - window.innerHeight <= 0;
  },

  isNextPageAvailable: function(pictures, page, pageSize) {
    return page < Math.floor(this.filteredPictures.length / pageSize);
  }
};
