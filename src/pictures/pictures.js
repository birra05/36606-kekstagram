'use strict';

var filtersFile = require('./filters');

var picturesContainer = document.querySelector('.pictures');
var containerSides = picturesContainer.getBoundingClientRect();
var templateElement = document.querySelector('#picture-template');
var pics = [];
var filteredPictures = [];
var elementToClone;
var LOAD_URL = '//o0.github.io/assets/json/pictures.json';
var PAGE_SIZE = 12;
var pageNumber = 0;

// Для IE
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

// Создаем блок фотографии на основе шаблона
var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  // Создаем изображения
  var image = element.querySelector('img');

  var pictureImage = new Image();

  // Обработчик загрузки
  pictureImage.onload = function() {
    // Отмена таймаута
    clearTimeout(imageLoadTimeout);
    image.src = data.url;
    image.width = '182';
    image.height = '182';
    image.alt = data.date;
  };

  // Обработчик ошибки
  pictureImage.onerror = function() {
    image.classList.add('picture-load-failure');
  };

  pictureImage.src = data.url;

  // Таймаут
  var imageLoadTimeout = setTimeout(function() {
    image.src = '';
    image.classList.add('picture-load-failure');
  }, 5000);

  container.appendChild(element);
  return element;
};

var isBottomReached = function() {
  return containerSides.top - window.innerHeight <= 0;
};

var isNextPageAvailable = function(pictures, page, pageSize) {
  return page < Math.floor(filteredPictures.length / pageSize);
};

// Отрисовка каждой картинки
var renderPictures = function(pictures, page, replace) {
  if(replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

  // Отрисовать все фото на экране с большим разрешением

  var picturesContainerHeight = parseFloat(getComputedStyle(picturesContainer).height);

  var blockIsNotFull = function() {
    return window.innerHeight - picturesContainerHeight > 0;
  };

  var renderNextPages = function() {
    while (blockIsNotFull() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderPictures(filteredPictures, pageNumber);
    }
  };

  renderNextPages();
};

var setFilterEnabled = function(filter) {
  filteredPictures = filtersFile.getFilteredPictures(pics, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
};

var setFiltrationEnabled = function() {
  // Делегирование
  filtersFile.filters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });
};

// Загружаем данные из файла по XMLHttpRequest
var getPictures = function(callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    picturesContainer.classList.add('pictures-loading');
    callback(loadedData);
  };

  // Обработчики ошибки и таймаута
  xhr.onerror = function() {
    picturesContainer.classList.add('pictures-failure');
  };

  xhr.timeout = 5000;
  xhr.ontimeout = function() {
    picturesContainer.classList.add('pictures-failure');
  };

  xhr.open('GET', LOAD_URL);
  xhr.send();
};

// Обработчик события scroll у объекта window, который отображает следующую страницу
// с фотографиями по достижении низа страницы
var setScrollEnabled = function() {
  var pictures;
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    // Оптмимизация скролла
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      while(isBottomReached() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};

getPictures(function(loadedPictures) {
  pics = loadedPictures;

  setFiltrationEnabled();
  setFilterEnabled('filter-popular');
  setScrollEnabled();
  picturesContainer.classList.remove('pictures-loading');
});
