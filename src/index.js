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

    this.currentMousePosition = null;  // текущая позиция курсора
    this.positionStartTime = null; // время начала нахождения в текущей позиции

    // подвязка методов к контексту
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.saveCurrentPosition = this.saveCurrentPosition.bind(this);
    this.updateCursorPosition = this.updateCursorPosition.bind(this);
    this.sendData = this.sendData.bind(this);
  }


  // Методы для обработчиков движения курсова
  handleMouseEnter(event) {
    this.isMouseOver = true;

    if (this.isTracking) {
      const coords = this.getRelativeCoordinates(event);
      this.updateCursorPosition(coords);
    }
  }

  handleMouseLeave() {
    this.isMouseOver = false;

    if (this.isTracking && this.currentMousePosition) {
      this.saveCurrentPosition();
      this.currentMousePosition = null;
      this.positionStartTime = null;
    }
  }

  handleMouseMove(event) {
    if (!this.isTracking || !this.isMouseOver) return

    const coords = this.getRelativeCoordinates(event);

    if (!this.currentMousePosition) {
      this.currentMousePosition = coords
    }

    this.updateCursorPosition(coords);
  }

  // Метод обновления и записи позиции курса
  updateCursorPosition(coords) {
    const now = Date.now();

    if (!this.currentMousePosition ||
      this.currentMousePosition.x !== coords.x ||
      this.currentMousePosition.y !== coords.y) {

      if (this.currentMousePosition && this.positionStartTime) {
        const timeSpent = now - this.positionStartTime;

        if (timeSpent >= this.options.checkInterval) {
          const lastEntry = this.data.length > 0 ? this.data[this.data.length - 1] : null;

          if (lastEntry &&
            lastEntry.x === this.currentMousePosition.x &&
            lastEntry.y === this.currentMousePosition.y) {
            lastEntry.time += timeSpent;
          } else {
            this.data.push({
              x: this.currentMousePosition.x,
              y: this.currentMousePosition.y,
              time: timeSpent
            });
          }
        }
      }

      this.currentMousePosition = coords;
      this.positionStartTime = now;
    }
  }

  // Метод для вычисления координат курсора
  getRelativeCoordinates(event) {
    const rect = this.element.getBoundingClientRect();

    return {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top)
    };
  }

  // Метод для сохранения координат курсора, нужна для кейса с handleMouseLeave
  saveCurrentPosition() {
    if (!this.currentMousePosition || !this.positionStartTime) return;

    const now = Date.now();
    const timeSpent = now - this.positionStartTime;

    if (timeSpent >= this.options.checkInterval) {
      this.data.push({
        x: this.currentMousePosition.x,
        y: this.currentMousePosition.y,
        time: timeSpent
      });
    }
  }

  // Метод для отправки данных на сервер
  async sendData() {
    if (!this.isTracking) return;
    if (this.data.length === 0) return;

    const dataToSend = [...this.data];
    this.data = [];

    try {
      const response = await fetch(this.options.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: dataToSend,
          timestamp: Date.now(),
          elementId: this.element.id || null
        })
      });

      if (response.ok) {
        console.log(`Отправлено ${dataToSend.length} точек координат`);
      } else {
        console.warn(`Сервер вернул ошибку ${response.status}: ${response.statusText}`);
        this.data = [...dataToSend, ...this.data];
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      this.data = [...dataToSend, ...this.data];
    }
  }

  // Метод для старта отслеживания
  start() {
    if (this.isTracking) return;

    this.isTracking = true;

    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);

    setInterval(this.sendData, this.options.sendInterval);
  }
}

export { MouseTracker };
