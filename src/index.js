
class MouseTracker {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      checkInterval: options.checkInterval || 30, // период сбора данных в мс
      sendInterval: options.sendInterval || 3000, // период отправки на сервер в мс
      url: options.url || '/save.php' // URL для отправки данных
    };
  }


  start() {
    console.log(this.options.checkInterval, this.options.sendInterval, this.options.url)
  }


}

export { MouseTracker };
