'use strict';

(function() {

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var pics = [];
  var filteredPictures = [];
  var elementToClone;
  var LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  var PAGE_SIZE = 12;
  var pageNumber = 0;

  // Спрятать блок с фильтрами
  filters.classList.add('hidden');

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
  };

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

  var setFilterEnabled = function(filter) {
    filteredPictures = getFilteredPictures(pics, filter);
    pageNumber = 0;
    renderPictures(filteredPictures, pageNumber, true);
  };

  var setFiltrationEnabled = function() {
    // Делегирование
    filters.addEventListener('click', function(evt) {
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

  var isBottomReached = function() {
    var containerSides = picturesContainer.getBoundingClientRect();
    if(containerSides.top <= 0) {
      return true;
    } else {
      return false;
    }
  };

  var isNextPageAvailable = function(pictures, page, pageSize) {
    return page < Math.floor(filteredPictures.length / pageSize);
  };

  // Обработчик события scroll у объекта window, который отображает следующую страницу
  // с фотографиями по достижении низа страницы
  var setScrollEnabled = function() {
    var scrollTimeout;
    var pictures;
    window.addEventListener('scroll', function() {
      // Оптмимизация скролла
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (isBottomReached() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
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

  // После загрузки всех данных показать блок с фильтрами
  filters.classList.remove('hidden');
})();
