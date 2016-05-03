'use strict';

var browserCookies = require('browser-cookies');

/**
 * Форма добавления фильтра.
 * @type {HTMLFormElement}
 */

var filterForm = document.forms['upload-filter'];

/**
 * @type {HTMLImageElement}
 */
var filterImage = filterForm.querySelector('.filter-image-preview');

/**
 * @type {Object.<string, string>}
 */
var filterMap;

// Определяем, какой фильтр будет выбран для изображения по умолчанию, берем значение из куки
var setFilter = function() {
  var filter = browserCookies.get('filter') || 'none';
  filterImage.classList.add('filter-' + filter);
  document.getElementById('upload-filter-' + filter).checked = true;
};

/**
 * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
 * выбранному значению в форме.
 */

filterForm.addEventListener('change', function() {
  if (!filterMap) {
    // Ленивая инициализация. Объект не создается до тех пор, пока
    // не понадобится прочитать его в первый раз, а после этого запоминается
    // навсегда.
    filterMap = {
      'none': 'filter-none',
      'chrome': 'filter-chrome',
      'sepia': 'filter-sepia'
    };
  }

  this.selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
    return item.checked;
  })[0].value;

  // Класс перезаписывается, а не обновляется через classList потому что нужно
  // убрать предыдущий примененный класс. Для этого нужно или запоминать его
  // состояние или просто перезаписывать.
  filterImage.className = 'filter-image-preview ' + filterMap[this.selectedFilter];
});

module.exports = {
  filterForm: filterForm,
  filterImage: filterImage,
  setFilter: setFilter
};
