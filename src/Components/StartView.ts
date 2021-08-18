import { dataContainer } from '../index';
import { GameState } from './GameState';
import { HeroValues } from '../Models/responseModels';

import { Clickable, Draggable, DragTarget } from '../Models/eventlisteners';
import { autobind } from '../Decorators/autobind';
import { Component } from './Component';
import { Router } from './Router';
import { GameView } from './GameView';

export class StartView
  extends Component<HTMLDivElement, HTMLDivElement[]>
  implements Draggable, DragTarget, Clickable
{
  static instance: StartView;
  imagesLoaded: number = 0;
  selectedHeroId: string = '';
  heroList: HeroValues = dataContainer.heroes.list;

  constructor() {
    super('tmpl-hero-overview', 'app');
    this.render();
  }

  render() {
    for (const key in this.heroList) {
      const img = document.createElement('img');
      img.id = this.heroList[key].id.toString();
      img.classList.add('hero');
      img.onerror = () => this.updateDOM();
      img.onload = () => this.updateDOM();
      img.src = this.heroList[key].img;
      this.element[0].appendChild(img);
    }
    this.configureEventListeners();
  }

  private updateDOM() {
    this.imagesLoaded += 1;
    if (this.imagesLoaded === 121) {
      this.dispatch();
      this.attach(false);
      this.imagesLoaded = 0;
    }
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
    (<HTMLElement>event.target).classList.add('droppable');
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {
    (<HTMLElement>event.target).classList.remove('droppable');
  }

  @autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const heroId = event.dataTransfer!.getData('text/plain');
    const img = document.createElement('img');
    const transferData =
      this.heroList[event.dataTransfer!.getData('text/plain')];
    const firstChild = this.element[1].firstElementChild;

    img.id = transferData['id'];
    img.src = transferData['img'];

    if (firstChild?.firstElementChild) {
      firstChild?.firstElementChild.remove();
    }
    firstChild!.appendChild(img);
    this.selectedHeroId = transferData['id'];
  }

  @autobind
  clickHandler(event: MouseEvent) {
    if (this.selectedHeroId) this.callGameView(this.selectedHeroId);
  }

  async callGameView(heroId: string) {
    let init;
    try {
      init = dataContainer.initGameState(heroId, 'random');
      await Router.gameView();
    } catch (err) {
      console.log(err);
    }
  }

  private configureEventListeners() {
    (<HTMLInputElement>this.element[0]).addEventListener(
      'dragstart',
      this.dragStartHandler
    );
    (<HTMLInputElement>this.element[0]).addEventListener(
      'dragend',
      this.dragEndHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'dragover',
      this.dragOverHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'dragleave',
      this.dragLeaveHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'drop',
      this.dropHandler
    );
    (<HTMLInputElement>this.element[1].children[1]).addEventListener(
      'click',
      this.clickHandler
    );
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StartView();
    return this.instance;
  }
}
