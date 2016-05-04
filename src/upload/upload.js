/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */
'use strict';

var utilsModule = require('../utils');
var Resizer = require('./resizer');
var uploadFilterModule = require('./upload-filter');
var uploadMessageModule = require('./upload-message');
var browserCookies = require('browser-cookies');

/** @enum {string} */
var FileType = {
  'GIF': '',
  'JPEG': '',
  'PNG': '',
  'SVG+XML': ''
};

/**
 * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
 * из ключей FileType.
 * @type {RegExp}
 */
var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

/**
 * Объект, который занимается кадрированием изображения.
 * @type {Resizer}
 */
var currentResizer;

// Находим поля формы
var resizeLeft = document.querySelector('#resize-x');
var resizeTop = document.querySelector('#resize-y');
var resizeSide = document.querySelector('#resize-size');
var resizeButton = document.querySelector('#resize-fwd');

/**
 * Проверяет, валидны ли данные в форме кадрирования.
 * @return {boolean}
 */
var resizeFormIsValid = function() {
  return true;
};

/**
 * Форма загрузки изображения.
 * @type {HTMLFormElement}
 */
var uploadForm = document.forms['upload-select-image'];

/**
 * Форма кадрирования изображения.
 * @type {HTMLFormElement}
 */
var resizeForm = document.forms['upload-resize'];

 /**
  * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
  * изображением.
  */
var cleanupResizer = function() {
  if (currentResizer) {
    currentResizer.remove();
    currentResizer = null;
  }
};

/**
 * Обработчик изменения изображения в форме загрузки. Если загруженный
 * файл является изображением, считывается исходник картинки, создается
 * Resizer с загруженной картинкой, добавляется в форму кадрирования
 * и показывается форма кадрирования.
 * @param {Event} evt
 */
uploadForm.addEventListener('change', function(evt) {
  var element = evt.target;
  if (element.id === 'upload-file') {
    // Проверка типа загружаемого файла, тип должен быть изображением
    // одного из форматов: JPEG, PNG, GIF или SVG.
    if (fileRegExp.test(element.files[0].type)) {
      var fileReader = new FileReader();

      uploadMessageModule.showMessage(uploadMessageModule.Action.UPLOADING);

      fileReader.onload = function() {
        cleanupResizer();

        currentResizer = new Resizer(fileReader.result);
        currentResizer.setElement(resizeForm);
        utilsModule.hideElement(uploadMessageModule.uploadMessage);

        utilsModule.hideElement(uploadForm);
        utilsModule.showElement(resizeForm);

        setValues();

        uploadMessageModule.hideMessage();
      };

      fileReader.readAsDataURL(element.files[0]);
    } else {
      // Показ сообщения об ошибке, если загружаемый файл, не является
      // поддерживаемым изображением.
      uploadMessageModule.showMessage(uploadMessageModule.Action.ERROR);
    }
  }
});

/**
 * Обработка сброса формы кадрирования. Возвращает в начальное состояние
 * и обновляет фон.
 * @param {Event} evt
 */

resizeForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  cleanupResizer();
  utilsModule.updateBackground();

  utilsModule.hideElement(resizeForm);
  utilsModule.showElement(uploadForm);
});

//Установка начальных значений в формы
var setValues = function() {
  var imageWidth = currentResizer._image.naturalWidth;
  var imageHeight = currentResizer._image.naturalHeight;

  resizeLeft.min = 0;
  resizeTop.min = 0;
  resizeSide.min = 0;

  resizeLeft.max = imageWidth;
  resizeTop.max = imageHeight;
  resizeSide.max = resizeSide.value;

  resizeButton.disabled = false;
};

// Проверка вводимых значений
resizeForm.addEventListener('input', function() {
  var imageWidth = currentResizer._image.naturalWidth;
  var imageHeight = currentResizer._image.naturalHeight;
  var x = parseFloat(resizeLeft.value) + parseFloat(resizeSide.value);
  var y = parseFloat(resizeTop.value) + parseFloat(resizeSide.value);

  if(x > imageWidth || y > imageHeight) {
    resizeButton.disabled = true;
    // Cообщение об ошибке, если данные в форме невалидны
    utilsModule.showElement(document.querySelector('.valid-message'));
  } else if(x <= imageWidth || y <= imageHeight) {
    resizeButton.disabled = false;
    // Убираем сообщение об ошибке
    utilsModule.hideElement(document.querySelector('.valid-message'));
  }

  currentResizer.setConstraint(+resizeLeft.value, +resizeTop.value, +resizeSide.value);
});

/**
 * Сброс формы фильтра. Показывает форму кадрирования.
 * @param {Event} evt
 */

uploadFilterModule.filterForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  utilsModule.hideElement(uploadFilterModule.filterForm);
  utilsModule.showElement(resizeForm);
});

/**
 * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
 * кропнутое изображение в форму добавления фильтра и показывает ее.
 * @param {Event} evt
 */

resizeForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  if (resizeFormIsValid()) {
    uploadFilterModule.filterImage.src = currentResizer.exportImage().src;

    utilsModule.hideElement(resizeForm);
    utilsModule.showElement(uploadFilterModule.filterForm);

    uploadFilterModule.setFilter();
  }
});

/**
 * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
 * записав сохраненный фильтр в cookie.
 * @param {Event} evt
 */

uploadFilterModule.filterForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  cleanupResizer();
  utilsModule.updateBackground();

  utilsModule.hideElement(uploadFilterModule.filterForm);
  utilsModule.showElement(uploadForm);

  browserCookies.set('filter', this.selectedFilter, {expires: utilsModule.setCookiesDate()});
});

var syncFormAndResizer = function() {
  resizeLeft.value = Math.floor(currentResizer.getConstraint().x);
  resizeTop.value = Math.floor(currentResizer.getConstraint().y);
  resizeSide.value = Math.floor(currentResizer.getConstraint().side);
};

window.addEventListener('resizerchange', function() {
  syncFormAndResizer();
});

cleanupResizer();
utilsModule.updateBackground();
