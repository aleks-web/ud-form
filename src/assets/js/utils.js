/*
* Плавное появление
* @param {number} duration - Скорость анимации
* @param {number} opacity - Установка значения opacity при открытии. Итоговое значение. Может пригодиться, например для фона модалки
* @param {string} display - Свойство display, которое нужно установить для элемента
* @param {callback} callback - Функция, которая срабатывает после завершения анимации
* */
HTMLElement.prototype.fadeIn = function (duration = 300, opacity = 1, display = 'block', callback = () => {}) {
    this.style.opacity = 0;
    this.style.display = display || 'block';
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);
        this.style.opacity = progress * opacity;

        if (progress < opacity) {
            requestAnimationFrame(animation.bind(this));
        } else {
            callback(this, { duration, opacity, display, callback });
        }
    }

    requestAnimationFrame(animation.bind(this));
}

/*
* Плавное исчезновение
* @param {number} duration - Скорость анимации
* @param {callback} callback - Функция, которая срабатывает после завершения анимации
* */
HTMLElement.prototype.fadeOut = function (duration = 300, callback = () => {}) {
    this.style.opacity = this.style.opacity ? this.style.opacity : 1;
    let opacityStart = Number(this.style.opacity);
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, opacityStart);
        this.style.opacity = opacityStart - progress;

        if (progress < opacityStart) {
            requestAnimationFrame(animation.bind(this));
        } else {
            this.style.display = 'none';
            callback(this, { duration, callback });
        }
    }

    requestAnimationFrame(animation.bind(this));
}