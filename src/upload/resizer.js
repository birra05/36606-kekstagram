'use strict';

/**
 * @constructor
 * @param {string} image
 */

var utilsModule = require('../utils');

var Resizer = function(image) {
  //  Изображение, с которым будет вестись работа.
  this._image = new Image();
  this._image.src = image;

  // Холст.
  this._container = document.createElement('canvas');
  this._ctx = this._container.getContext('2d');

  // Создаем холст только после загрузки изображения.
  this._image.onload = function() {
    //  Размер холста равен размеру загруженного изображения. Это нужно
    //  для удобства работы с координатами.
    this._container.width = this._image.naturalWidth;
    this._container.height = this._image.naturalHeight;

    /**
      * Предлагаемый размер кадра в виде коэффициента относительно меньшей
      * стороны изображения.
      * @const
      * @type {number}
      */
    var INITIAL_SIDE_RATIO = 0.75;

    // Размер меньшей стороны изображения.
    var side = Math.min(
        this._container.width * INITIAL_SIDE_RATIO,
        this._container.height * INITIAL_SIDE_RATIO);

    //  Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
    //  от размера меньшей стороны.
    this._resizeConstraint = new utilsModule.Square(
         this._container.width / 2 - side / 2,
         this._container.height / 2 - side / 2,
         side);

    //  Отрисовка изначального состояния канваса.
    this.setConstraint();
  }.bind(this);

  //  Фиксирование контекста обработчиков.
  this._onDragStart = this._onDragStart.bind(this);
  this._onDragEnd = this._onDragEnd.bind(this);
  this._onDrag = this._onDrag.bind(this);
};

/**
 * Родительский элемент канваса.
 * @type {Element}
 * @private
 */

Resizer.prototype._element = function() {
  return null;
};

/**
 * Положение курсора в момент перетаскивания. От положения курсора
 * рассчитывается смещение на которое нужно переместить изображение
 * за каждую итерацию перетаскивания.
 * @type {Coordinate}
 * @private
 */

Resizer.prototype._cursorPosition = function() {
  return null;
};

/**
 * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
 * от верхнего левого угла исходного изображения.
 * @type {Square}
 * @private
 */

Resizer.prototype._resizeConstraint = function() {
  return null;
};

/**
 * Отрисовка канваса.
 */

Resizer.prototype.redraw = function() {
  // Очистка изображения.
  this._ctx.clearRect(0, 0, this._container.width, this._container.height);

  // Параметры линии.
  // NB! Такие параметры сохраняются на время всего процесса отрисовки
  // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
  // чего-либо с другой обводкой.

  // Толщина линии.
  this._ctx.lineWidth = 3; //изменено для зигзага
  // Цвет обводки.
  // this._ctx.strokeStyle = '#ffe753';
  // // Размер штрихов. Первый элемент массива задает длину штриха, второй
  // // расстояние между соседними штрихами.
  // this._ctx.setLineDash([15, 10]);
  // // Смещение первого штриха от начала линии.
  // this._ctx.lineDashOffset = 7;

  // Сохранение состояния канваса.
  // Подробней см. строку 132.
  this._ctx.save();

  // Установка начальной точки системы координат в центр холста.
  this._ctx.translate(this._container.width / 2, this._container.height / 2);

  var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
  var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
  // Отрисовка изображения на холсте. Параметры задают изображение, которое
  // нужно отрисовать и координаты его верхнего левого угла.
  // Координаты задаются от центра холста.
  this._ctx.drawImage(this._image, displX, displY);

  // Вокруг жёлтой ограничительной рамки рисуется чёрный слой с прозрачностью 80%
  this._ctx.fillStyle = 'rgba(0,0,0,0.8)';

  this._ctx.beginPath();

  // Отрисовка прямоугольника, обозначающего область изображения после
  // кадрирования. Координаты задаются от центра.
  this._ctx.rect(displX, displY, this._container.width, this._container.height);
  this._ctx.rect(
      this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2,
      -this._resizeConstraint.side / 2 - this._ctx.lineWidth,
     -this._resizeConstraint.side - this._ctx.lineWidth / 2,
      this._resizeConstraint.side + this._ctx.lineWidth / 2
    );
  this._ctx.fill();

  // Вывести размеры кадрируемого изображения над рамкой
  this._ctx.fillStyle = '#fff';
  this._ctx.font = '20px Open Sans';
  this._ctx.textAlign = 'center';
  this._ctx.textBaseline = 'bottom';

  // Точки отсчета для вывода текста
  var textX = 0;
  var textY = -this._resizeConstraint.side / 2 - this._ctx.lineWidth * 3;

  var textMessage = this._container.width + ' x ' + this._container.height;
  this._ctx.fillText(textMessage, textX, textY);

  // Рамка, нарисованная зигзагами
  this._ctx.strokeStyle = '#ffe753';

  var lineLength = this._resizeConstraint.side;
  var lineWidth = this._ctx.lineWidth;
  var startX = -lineLength / 2 - lineWidth / 2;
  var startY = startX;
  var zigzagNumber = 30;
  var zigzagSpacing = lineLength / zigzagNumber;

  this._ctx.beginPath();
  this._ctx.moveTo(startX, startY);

  this.drawZigzagTop = function() {
    for (var n = 0; n < zigzagNumber; n++) {
      var x = startX + (n + 1) * zigzagSpacing;
      var y;

      if (n % 2 === 0) {
        y = startY - zigzagSpacing;
      } else {
        y = startY;
      }

      this._ctx.lineTo(x, y);
    }
  };

  this.drawZigzagRight = function() {
    for (var n = 0; n < zigzagNumber; n++) {
      var x;
      var y = startY + (n + 1) * zigzagSpacing;

      if (n % 2 === 0) {
        x = startX + zigzagSpacing;
      } else {
        x = startX;
      }
      this._ctx.lineTo(x + lineLength, y);
    }
  };

  this.drawZigzagBottom = function() {
    for (var n = 0; n < zigzagNumber; n++) {
      var x = startX + lineLength + n * zigzagSpacing;
      var y;

      if (n % 2 === 0) {
        y = startY + lineLength;
      } else {
        y = startY + lineLength + zigzagSpacing;
      }
      this._ctx.lineTo(lineLength - lineWidth - x, y);
    }
  };

  this.drawZigzagLeft = function() {
    for (var n = 0; n < zigzagNumber; n++) {
      var x;
      var y = startY + (n + 1) * zigzagSpacing;

      if (n % 2 === 0) {
        x = startX;
      } else {
        x = startX + zigzagSpacing;
      }
      this._ctx.lineTo(x - zigzagSpacing, -y - lineWidth);
    }
  };

  this.drawZigzagTop();
  this.drawZigzagRight();
  this.drawZigzagBottom();
  this.drawZigzagLeft();

  this._ctx.stroke();

  // Рамка, нарисованная точками
  this._ctx.fillStyle = '#ffe753';

  this.drawDottedTop = function() {
    var x = startX;
    var y = startY;

    for(var i = x; i <= x + lineLength; i += 15) {
      this._ctx.beginPath();
      this._ctx.arc(i, y, 3, 0, Math.PI * 2);
      this._ctx.closePath();
      this._ctx.fill();
    }
  };

  this.drawDottedRight = function() {
    var x = -startX;
    var y = startY;

    for(var i = y; i <= y + lineLength; i += 15 ) {
      this._ctx.beginPath();
      this._ctx.arc(x, i, 3, 0, Math.PI * 2);
      this._ctx.closePath();
      this._ctx.fill();
    }
  };

  this.drawDottedBottom = function() {
    var x = -startX;
    var y = -startY;

    for(var i = x; i >= x - lineLength - lineWidth; i -= 15 ) {
      this._ctx.beginPath();
      this._ctx.arc(i, y, 3, 0, Math.PI * 2);
      this._ctx.closePath();
      this._ctx.fill();
    }
  };

  this.drawDottedLeft = function() {
    var x = startX;
    var y = -startY;

    for(var i = y; i >= y - lineLength - lineWidth; i -= 15 ) {
      this._ctx.beginPath();
      this._ctx.arc(x, i, 3, 0, Math.PI * 2);
      this._ctx.closePath();
      this._ctx.fill();
    }
  };

  // this.drawDottedTop();
  // this.drawDottedRight();
  // this.drawDottedBottom();
  // this.drawDottedLeft();

  // Восстановление состояния канваса, которое было до вызова ctx.save
  // и последующего изменения системы координат. Нужно для того, чтобы
  // следующий кадр рисовался с привычной системой координат, где точка
  // 0 0 находится в левом верхнем углу холста, в противном случае
  // некорректно сработает даже очистка холста или нужно будет использовать
  // сложные рассчеты для координат прямоугольника, который нужно очистить.
  this._ctx.restore();
};

/**
 * Включение режима перемещения. Запоминается текущее положение курсора,
 * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
 * позволяющие перерисовывать изображение по мере перетаскивания.
 * @param {number} x
 * @param {number} y
 * @private
 */

Resizer.prototype._enterDragMode = function(x, y) {
  this._cursorPosition = new utilsModule.Coordinate(x, y);
  document.body.addEventListener('mousemove', this._onDrag);
  document.body.addEventListener('mouseup', this._onDragEnd);
};

/**
 * Выключение режима перемещения.
 * @private
 */
Resizer.prototype._exitDragMode = function() {
  this._cursorPosition = null;
  document.body.removeEventListener('mousemove', this._onDrag);
  document.body.removeEventListener('mouseup', this._onDragEnd);
};

/**
 * Перемещение изображения относительно кадра.
 * @param {number} x
 * @param {number} y
 * @private
 */
Resizer.prototype.updatePosition = function(x, y) {
  this.moveConstraint(
      this._cursorPosition.x - x,
      this._cursorPosition.y - y);
  this._cursorPosition = new utilsModule.Coordinate(x, y);
};

/**
 * @param {MouseEvent} evt
 * @private
 */
Resizer.prototype._onDragStart = function(evt) {
  this._enterDragMode(evt.clientX, evt.clientY);
};

/**
 * Обработчик окончания перетаскивания.
 * @private
 */
Resizer.prototype._onDragEnd = function() {
  this._exitDragMode();
};

/**
 * Обработчик события перетаскивания.
 * @param {MouseEvent} evt
 * @private
 */
Resizer.prototype._onDrag = function(evt) {
  this.updatePosition(evt.clientX, evt.clientY);
};

/**
 * Добавление элемента в DOM.
 * @param {Element} element
 */
Resizer.prototype.setElement = function(element) {
  if (this._element === element) {
    return;
  }

  this._element = element;
  this._element.insertBefore(this._container, this._element.firstChild);
  // Обработчики начала и конца перетаскивания.
  this._container.addEventListener('mousedown', this._onDragStart);
};

/**
 * Возвращает кадрирование элемента.
 * @return {Square}
 */
Resizer.prototype.getConstraint = function() {
  return this._resizeConstraint;
};

/**
 * Смещает кадрирование на значение указанное в параметрах.
 * @param {number} deltaX
 * @param {number} deltaY
 * @param {number} deltaSide
 */
Resizer.prototype.moveConstraint = function(deltaX, deltaY, deltaSide) {
  this.setConstraint(
      this._resizeConstraint.x + (deltaX || 0),
      this._resizeConstraint.y + (deltaY || 0),
      this._resizeConstraint.side + (deltaSide || 0));
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} side
 */
Resizer.prototype.setConstraint = function(x, y, side) {
  if (typeof x !== 'undefined') {
    this._resizeConstraint.x = x;
  }

  if (typeof y !== 'undefined') {
    this._resizeConstraint.y = y;
  }

  if (typeof side !== 'undefined') {
    this._resizeConstraint.side = side;
  }

  requestAnimationFrame(function() {
    this.redraw();
    window.dispatchEvent(new CustomEvent('resizerchange'));
  }.bind(this));
};

/**
 * Удаление. Убирает контейнер из родительского элемента, убирает
 * все обработчики событий и убирает ссылки.
 */
Resizer.prototype.remove = function() {
  this._element.removeChild(this._container);

  this._container.removeEventListener('mousedown', this._onDragStart);
  this._container = null;
};

/**
 * Экспорт обрезанного изображения как HTMLImageElement и исходником
 * картинки в src в формате dataURL.
 * @return {Image}
 */
Resizer.prototype.exportImage = function() {
  // Создаем Image, с размерами, указанными при кадрировании.
  var imageToExport = new Image();

  // Создается новый canvas, по размерам совпадающий с кадрированным
  // изображением, в него добавляется изображение взятое из канваса
  // с измененными координатами и сохраняется в dataURL, с помощью метода
  // toDataURL. Полученный исходный код, записывается в src у ранее
  // созданного изображения.
  var temporaryCanvas = document.createElement('canvas');
  var temporaryCtx = temporaryCanvas.getContext('2d');
  temporaryCanvas.width = this._resizeConstraint.side;
  temporaryCanvas.height = this._resizeConstraint.side;
  temporaryCtx.drawImage(this._image,
      -this._resizeConstraint.x,
      -this._resizeConstraint.y);
  imageToExport.src = temporaryCanvas.toDataURL('image/png');

  return imageToExport;
};

module.exports = Resizer;
