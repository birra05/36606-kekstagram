'use strict';

(function() {
  // Спрятать блок с фильтрами
  document.querySelector('.filters').classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('#picture-template');
  var pictures = window.pictures;
  var elementToClone;
  var LOAD_URL = '//o0.github.io/assets/json/pictures.json';

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

  // Загружаем данные из файла по XMLHttpRequest
  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var renderPictures = function() {
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);
  });

  // После загрузки всех данных показать блок с фильтрами
  document.querySelector('.filters').classList.remove('hidden');

})();
