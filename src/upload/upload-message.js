'use strict';

var utilsModule = require('../base/utils');

/**
 * @type {HTMLElement}
 */
var uploadMessage = document.querySelector('.upload-message');

/** @enum {number} */
var Action = {
  ERROR: 0,
  UPLOADING: 1,
  CUSTOM: 2
};

/**
 * @param {Action} action
 * @param {string=} message
 * @return {Element}
 */
var showMessage = function(action, message) {
  var isError = false;

  switch (action) {
    case Action.UPLOADING:
      message = message || 'Кексограмим&hellip;';
      break;

    case Action.ERROR:
      isError = true;
      message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
      break;
  }

  uploadMessage.querySelector('.upload-message-container').innerHTML = message;
  utilsModule.showElement(uploadMessage);
  uploadMessage.classList.toggle('upload-message-error', isError);
  return uploadMessage;
};

var hideMessage = function() {
  utilsModule.hideElement(uploadMessage);
};

module.exports = {
  uploadMessage: uploadMessage,
  Action: Action,
  showMessage: showMessage,
  hideMessage: hideMessage
};
