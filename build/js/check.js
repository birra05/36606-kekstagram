'use strict';

function getMessage(a, b) {

  if (a === true) {
    return ('Переданное GIF-изображение анимировано и содержит ' + b + ' кадров');
  } else if (a === false) {
    return ('Переданное GIF-изображение не анимировано');
  } else if (typeof a === 'number') {
    return ('Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов');
  } else if (a instanceof Array && b instanceof Array) {
    var square = 0;
    for (var i = 0; i < a.length && i < b.length; i++) {
      square += a[i] * b[i];
    }
    return ('Общая площадь артефактов сжатия: ' + square + ' пикселей');
  } else if (a instanceof Array) {
    var sum = 0;
    for (var x = 0; x < a.length; x++) {
      sum += a[x];
    }
    return ('Количество красных точек во всех строчках изображения: ' + sum);
  }
  return (a, b);
}

getMessage();
