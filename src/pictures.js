/* global pictures */

'use strict';

(function() {
  // Спрятать блок с фильтрами
  document.querySelector('.filters').classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

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
      image.src = data.url;
      image.width = '182';
      image.height = '182';
    };

    // Обработчик ошибки
    pictureImage.onerror = function() {
      image.classList.add('picture-load-failure');
    };

    pictureImage.src = data.url;

    container.appendChild(element);
    return element;
  };

  // Проходим по массиву
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

  // После загрузки всех данных показать блок с фильтрами
  document.querySelector('.filters').classList.remove('hidden');

})();
