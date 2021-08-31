import { Component } from './Component';
import { dataContainer } from '../index';
import { ItemValuesChild } from '../Models/responseModels';
import { autobind } from '../Decorators/autobind';
import { Draggable, DragTarget } from '../Models/eventlisteners';
import { itemStats } from '../Models/heroStartItems/startItems';

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
      heroContainer.children[2]
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
      opponentContainer.children[2]
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
        heroContainer.children[2]
      );
    }
  }

  // drophandler opponent
  @autobind
  dropOpponent(event: DragEvent) {
    event.preventDefault();
    const newItem = event.dataTransfer!.getData('text/plain');
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
        opponentContainer.children[2]
      );
    }
  }

  private configureEventListeners() {
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
