import { Component } from './Component';
import { dataContainer } from '../index';
import { ItemValuesChild } from '../Models/responseModels';
import { autobind } from '../Decorators/autobind';
import { Draggable, DragTarget } from '../Models/eventlisteners';

export class GameView
  extends Component<HTMLDivElement, [HTMLDivElement]>
  implements Draggable, DragTarget
{
  static instance: GameView;
  gameContainer = this.element[0].firstElementChild!.children;
  startItemsContainer = this.element[0].children[2];

  constructor() {
    super('tmpl-game-view', 'app');
    this.renderHero();
    this.renderOpponent();
    this.renderStartItems();
    this.dispatch();
    this.attach(true);
    this.configureEventListeners();
  }

  private renderItems(
    source: ItemValuesChild[],
    target: Element,
    className: string
  ) {
    const items = Object.values(source);

    while (target.firstChild) {
      target.removeChild(<HTMLElement>target.lastChild);
    }

    items.map((x) => {
      if (x) {
        const img = document.createElement('img');
        img.src = x['img'];
        img.id = x['id'].toString();
        img.classList.add(className);
        target.appendChild(img);
        return;
      }
    });
  }

  private renderStartItems() {
    this.renderItems(
      dataContainer.gameState.startItems,
      this.startItemsContainer,
      'allItems'
    );
  }

  private renderGold(source: number, target: Element) {
    target.textContent = (600 - source).toString() + ' Gold left';
  }

  private renderHero() {
    const heroContainer = this.gameContainer[0];
    (<HTMLImageElement>heroContainer.children[0]).src =
      dataContainer.gameState.heroObj['img'];
    this.renderItems(
      dataContainer.gameState.heroItems,
      heroContainer.children[1],
      'hero'
    );
    this.renderGold(
      dataContainer.gameState.heroGold,
      heroContainer.children[3]
    );
  }

  private renderOpponent() {
    const opponentContainer = this.gameContainer[2];
    (<HTMLImageElement>opponentContainer.children[0]).src =
      dataContainer.gameState.currentOpponent['img'].toString();
    this.renderItems(
      dataContainer.gameState.opponentItems,
      opponentContainer.children[1],
      'opponent'
    );
    this.renderGold(
      dataContainer.gameState.opponentGold,
      opponentContainer.children[3]
    );
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', (<HTMLElement>event.target).id);
    event.dataTransfer!.effectAllowed = 'copy';
  }

  @autobind
  dragEndHandler(_: DragEvent) {}
  @autobind
  dragOverHandler(event: DragEvent) {
    event.preventDefault();
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {}

  // drophandler only for hero
  @autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const newItem = event.dataTransfer!.getData('text/plain');
    if (!+newItem) {
      return;
    }
    const oldItem = (<HTMLElement>event.target!).id;
    const target = (<HTMLElement>event.target!).className;

    if (dataContainer.gameState.enoughGold(newItem, oldItem, 'heroGold')) {
      dataContainer.gameState.initChange(newItem, oldItem, target);
      const heroContainer = this.gameContainer[0];
      this.renderItems(
        dataContainer.gameState.heroItems,
        heroContainer.children[1],
        'hero'
      );
      this.renderGold(
        dataContainer.gameState.heroGold,
        heroContainer.children[3]
      );
    }
  }

  // drophandler opponent
  @autobind
  dropOpponent(event: DragEvent) {
    event.preventDefault();
    const newItem = event.dataTransfer!.getData('text/plain');
    if (!+newItem) {
      return;
    }
    const oldItem = (<HTMLElement>event.target!).id;
    const target = (<HTMLElement>event.target!).className;
    if (dataContainer.gameState.enoughGold(newItem, oldItem, 'opponentGold')) {
      dataContainer.gameState.initChange(newItem, oldItem, target);
      const opponentContainer = this.gameContainer[2];
      this.renderItems(
        dataContainer.gameState.opponentItems,
        opponentContainer.children[1],
        'opponent'
      );
      this.renderGold(
        dataContainer.gameState.opponentGold,
        opponentContainer.children[3]
      );
    }
  }

  @autobind
  private resetItems(event: MouseEvent) {
    const id = (<HTMLElement>event.target).id;
    if (id === 'reset-hero') {
      const heroContainer = this.gameContainer[0];
      dataContainer.gameState.reset('heroGold', 'heroItems');
      this.renderItems(
        dataContainer.gameState.heroItems,
        heroContainer.children[1],
        'hero'
      );
      this.renderGold(
        dataContainer.gameState.heroGold,
        heroContainer.children[3]
      );
      return;
    }
    if (id === 'reset-opponent') {
      dataContainer.gameState.reset('opponentGold', 'opponentItems');
      const opponentContainer = this.gameContainer[2];
      this.renderItems(
        dataContainer.gameState.opponentItems,
        opponentContainer.children[1],
        'opponent'
      );
      this.renderGold(
        dataContainer.gameState.opponentGold,
        opponentContainer.children[3]
      );
    }
  }

  @autobind
  private calculateWinner(event: MouseEvent) {
    (<HTMLButtonElement>event.target)!.classList.remove('active-btns');
    const winnerObject = dataContainer.gameState.performCalculation();
    let announceWinnerEl = document.getElementById('outcome-text');

    let timer: number;
    if (winnerObject['heroWon']) {
      timer = winnerObject.heroDeleteTimer - winnerObject.opponentDeleteTimer;
    }
    if (!winnerObject['heroWon']) {
      timer = winnerObject.opponentDeleteTimer - winnerObject.heroDeleteTimer;
    }
    const time = document.getElementById('time');

    const app = document.querySelector('#app');
    app!.classList.add('freeze');

    winnerObject['heroWon'] === true
      ? ((<HTMLDivElement>announceWinnerEl).innerText = 'You won!')
      : ((<HTMLDivElement>announceWinnerEl).innerText = 'You lost!');
    (<HTMLDivElement>announceWinnerEl)!.style.transition = 'all 2s ease-in-out';
    (<HTMLDivElement>announceWinnerEl)!.style.transform = 'scale(3)';

    setTimeout(() => {
      (<HTMLDivElement>announceWinnerEl)!.style.transition =
        'all 2s ease-in-out';
      (<HTMLDivElement>announceWinnerEl)!.style.transform = 'scale(0)';
    }, 2000);

    setTimeout(() => {
      (<HTMLDivElement>time).innerText =
        timer!.toFixed(2).toString() + ' seconds time difference.';
    }, 1000);
    setTimeout(() => {
      app!.classList.remove('freeze');
      (<HTMLButtonElement>event.target)!.classList.add('active-btns');
    }, 4000);

    //  transition: all 2s ease-in-out;
    //transform: scale(5);
  }

  @autobind
  private callNextOpponent(event: MouseEvent) {
    if (dataContainer.gameState.gameMode === 'selected') {
      return;
    }
    dataContainer.gameState.setCurrentOpponent();
    dataContainer.gameState.getOpponentItems();
    const opponentContainer = this.gameContainer[2];
    this.renderOpponent();
    return;
  }

  private configureEventListeners() {
    const resetBtns = document.querySelectorAll('.reset-btns');
    resetBtns.forEach((btn) =>
      (<HTMLElement>btn).addEventListener('click', this.resetItems)
    );

    const nextOpponent = document.querySelector('#next');
    (<HTMLElement>nextOpponent).addEventListener(
      'click',
      this.callNextOpponent
    );

    const calculateBtn = document.querySelector('#calculate');
    (<HTMLElement>calculateBtn).addEventListener('click', this.calculateWinner);

    (<HTMLInputElement>this.startItemsContainer).addEventListener(
      'dragstart',
      this.dragStartHandler
    );
    (<HTMLInputElement>this.startItemsContainer).addEventListener(
      'dragend',
      this.dragEndHandler
    );
    (<HTMLInputElement>this.gameContainer[0].children[1]).addEventListener(
      'dragover',
      this.dragOverHandler
    );
    (<HTMLInputElement>this.gameContainer[0].children[1]).addEventListener(
      'dragleave',
      this.dragLeaveHandler
    );
    (<HTMLInputElement>this.gameContainer[0].children[1]).addEventListener(
      'drop',
      this.dropHandler
    );

    // opponent
    (<HTMLInputElement>this.gameContainer[2].children[1]).addEventListener(
      'dragover',
      this.dragOverHandler
    );
    (<HTMLInputElement>this.gameContainer[2].children[1]).addEventListener(
      'dragleave',
      this.dragLeaveHandler
    );
    (<HTMLInputElement>this.gameContainer[2].children[1]).addEventListener(
      'drop',
      this.dropOpponent
    );
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new GameView();
    return this.instance;
  }
}
