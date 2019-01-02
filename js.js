"use strict";

/**
 * Объект с настройками игры.
 * @property {int} rowsCount - Количество строк в карте.
 * @property {int} colsCount - Количество колонок в карте.
 * @property {int} startPositionX - Начальная позиция игрока по X координате.
 * @property {int} startPositionY - Начальная позиция игрока по Y координате.
 * @property {string} startDirection - Начальное направление игрока.
 * @property {number} stepsInSecond - Шагов в секунду.
 * @property {string} playerCellColor - Цвет ячейки игрока.
 * @property {string} emptyCellColor - Цвет пустой ячейки.
 */

const settings = {
    colsCount: 10,
    rowsCount: 10,
    startPositionX: 0,
    startPositionY: 0,
    startDirection: 'right',
    stepsInSecond: 5,
    playerCellColor: 'red',
    emptyCellColor: 'blue',
};

/**
 * Объект игрока, здесь будут все методы и свойства связанные с ним непосредственно.
 * @property {int} x - Позиция по X-координате.
 * @property {int} y - Позиция по Y-координате.
 * @property {string} direction - Направление игрока.
 */

const player = {
    x: null,
    y: null,
    direction: null,

    /**
     * Инициализирует игрока.
     * @param {int} startX Позиция по X-координате.
     * @param {int} startY Позиция по Y-координате.
     * @param {string} startDirection Начальное направление игрока.
     */

    init(startX, startY, startDirection){
        this.x = startX;
        this.y = startY;
        this.direction = startDirection;
    },

    /**
     * Ставит направление по переданной нажатой кнопке.
     * @param {string} direction
     */

    setDirection(direction){
        this.direction = direction;
    },

    makeStep(){
        // Получаем координаты следующей точки.
        const nextPoint = this.getNextStepPoint();
        // Ставим координаты следующей точки вместо текущей.
        this.x = nextPoint.x;
        this.y = nextPoint.y;
    },

    getNextStepPoint() {
        //Текущая позиция игрока
        const point = {
            x: this.x,
            y: this.y,
        };
        // Смещаем игрока на один шаг в зависимости от направления.
        switch (this.direction) {
            case 'up':
                point.y--;
                break;
            case 'down':
                point.y++;
                break;
            case  'right':
                point.x++;
                break;
            case 'left':
                point.x--;
                break;
        }
        // Возвращаем позицию игрока после смещения.
        return point;
    }
};

/**
 * Объект игры, здесь будут все методы и свойства связанные с ней.
 * @property {player} player Игрок, участвующий в игре.
 * @property {settings} settings Настройки игры.
 * @property {Array} cellElements Массив ячеек нашей игры.
 * @property {HTMLElement} containerElement Контейнер, где будет размещаться наша игра.
 */

const game = {
    settings,
    player,
    containerElement: null,
    cellElements: null,

    /**
     * Запускает игру.
     */

    run(){
        this.init();
        this.render();
        setInterval(() => {
            if (this.canPlayerCanMakeStep()) {
                this.player.makeStep();
                this.render();
            }
        }, 1000/this.settings.stepsInSecond);
            },

    /**
     * Инициирует все значения для игры.
     */

    init(){
        this.player.init(this.settings.startPositionX, this.settings.startPositionY, this.settings.startDirection);
        this.containerElement = document.getElementById('game');
        this.initCells();
        this.initEventHandlers();
    },

    /**
     * Инициирует ячейки в игре.
     */

    initCells(){
    // Очищаем контейнер для игры.
    this.containerElement.innerHTML = '';
    // Массив ячеек пока пуст.
    this.cellElements = [];
    // Пробегаемся в цикле столько раз, какое количество строк в игре.
    for (let row = 0; row < this.settings.rowsCount; row++) {
        // Создаем новую строку.
        const trElem = document.createElement('tr');
        // Добавляем строку в контейнер с игрой.
        this.containerElement.appendChild(trElem);
        // В каждой строке пробегаемся по циклу столько раз, сколько у нас колонок.
        for (let col = 0; col < this.settings.colsCount; col++) {
            // Создаем ячейку.
            const tdElem = document.createElement('td');
            // Записываем ячейку в массив ячеек.
            this.cellElements.push(tdElem);
            // Добавляем ячейку в текущую строку.
            trElem.appendChild(tdElem);
           }
        }
    },

    /**
     * Инициирует обработчики событий.
     */
    initEventHandlers(){
        // При нажатии на любую клавишу в документе вызовется функция keyDownHandler.
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    /**
     * Обработчик события нажатия кнопки на клавиатуре.
     * @param {Event} event Событие, которое произошло.
     */

    keyDownHandler(event){
        // В зависимости от нажатой клавиши ставим направление игрока.
        switch (event.keyCode) {
            case 38:
            case 87:
                return this.player.setDirection('up');
            case 39:
            case 68:
                return this.player.setDirection('right');
            case 40:
            case 83:
                return this.player.setDirection('down');
            case 37:
            case 65:
                return this.player.setDirection('left');
        }
    },

    /**
     * Отображает в ячейках игровую информацию.
     */

    render(){
        // Всем ячейкам ставим цвет пустых ячеек, тоеть перекрашиваем их после шага.
        this.cellElements.forEach(cell => cell.style.backgroundColor = this.settings.emptyCellColor);
        // Получаем ячейку игрока.
        const playerCell = document
            .querySelector(`tr:nth-child(${this.player.y + 1})`)
            .querySelector(`td:nth-child(${this.player.x + 1})`);
        // Ячейке с игроком ставим цвет ячейки игрока.
        playerCell.style.backgroundColor = this.settings.playerCellColor;
    },
/**
 * Определяет может ли игрок совершить шаг.
 * @return {boolean} true, если шаг возможен, иначе false.
 */
   canPlayerCanMakeStep(){
       //Получаем позицию куда игрок хочет ступить.
    const nextPoint = this.player.getNextStepPoint();
    //Возвращаем правду толко в случае выполнения условий.
    return nextPoint.x >= 0 &&
        nextPoint.x < this.settings.colsCount &&
        nextPoint.y >= 0 &&
        nextPoint.y < this.settings.rowsCount;
    },
};

window.onload = () => game.run();