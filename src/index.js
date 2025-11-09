
class MouseTracker {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      checkInterval: options.checkInterval || 30, // период сбора данных в мс
      sendInterval: options.sendInterval || 3000, // период отправки на сервер в мс
      url: options.url || '/save.php' // URL для отправки данных
    };

    this.data = []; // массив собранных данных

    this.isTracking = false; // определяет запущен трекер или нет
    this.isMouseOver = false; // находится ли курсор над элементом

    this.currentPosition = null;  // текущая позиция курсора
    this.positionStartTime = null; // время начала нахождения в текущей позиции


    // подвязка обработчиков к контексту
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.saveCurrentPosition = this.saveCurrentPosition.bind(this);
    this.updateCursorPosition = this.updateCursorPosition.bind(this);
  }


  // Обработчики движения мыши
  handleMouseEnter() {
    this.isMouseOver = true;
  }

  handleMouseLeave() {
    this.isMouseOver = false;
  }


  handleMouseMove(event) {

    if (!this.isTracking || !this.isMouseOver) return

    const rect = this.element.getBoundingClientRect();
    const coords = {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top)
    };

    if (!this.currentPosition) {
      this.currentPosition = coords
    }


    // this.saveCurrentPosition()
    this.updateCursorPosition(coords);
  }

  updateCursorPosition(coords) {
    const now = Date.now();

    // Если позиция изменилась
    if (!this.currentPosition ||
      this.currentPosition.x !== coords.x ||
      this.currentPosition.y !== coords.y) {

      // Сохраняем время нахождения в предыдущей позиции перед изменением
      if (this.currentPosition && this.positionStartTime) {
        const timeSpent = now - this.positionStartTime;

        if (timeSpent > 0) {
          // Ищем последнюю запись с такими же координатами
          const lastEntry = this.data.length > 0 ? this.data[this.data.length - 1] : null;

          if (lastEntry &&
            lastEntry.x === this.currentPosition.x &&
            lastEntry.y === this.currentPosition.y) {
            // Отслеживаем время для существующей записи
            lastEntry.time += timeSpent;
          } else {
            // Создаем новую запись
            this.data.push({
              x: this.currentPosition.x,
              y: this.currentPosition.y,
              time: timeSpent
            });
          }
        }
      }

      // Начинаем отслеживать новую позицию
      this.currentPosition = coords;
      this.positionStartTime = now;
    }
  }

  // сохранить позицию в массив данных
  saveCurrentPosition() {

    this.data.push({
      x: this.currentPosition.x,
      y: this.currentPosition.y,
      time: 'timeSpent'
    });

  }

  // начать отслеживание
  start() {
    if (this.isTracking) return;

    this.isTracking = true;

    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);


    setInterval(() => {
      console.log(this.data)
    }, this.options.checkInterval)

    console.log(this.isTracking, 'isTracking')
    console.log(this.options.checkInterval, this.options.sendInterval, this.options.url, 'MouseTracker settings')
  }


}

export { MouseTracker };
