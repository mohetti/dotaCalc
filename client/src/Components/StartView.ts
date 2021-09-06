import { dataContainer } from '../index';
import { HeroValues } from '../Models/responseModels';

import { Clickable, Draggable, DragTarget } from '../Models/eventlisteners';
import { autobind } from '../Decorators/autobind';
import { Component } from './Component';
import { Router } from './Router';

export class StartView
  extends Component<HTMLDivElement, HTMLDivElement[]>
  implements Draggable, DragTarget, Clickable
{
  static instance: StartView;
  imagesLoaded: number = 0;
  selectedHeroId: string = '';
  selectedOpponentId: string = '';
  heroList: HeroValues = dataContainer.heroes.list;
  gamemode: 'random' | 'select' = 'random';

  constructor() {
    super('tmpl-hero-overview', 'app');
    this.render();
  }

  render() {
    for (const key in this.heroList) {
      const img = document.createElement('img');
      img.id = this.heroList[key].id.toString();
      img.classList.add('hero-portrait');
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
  dropHandlerSelectMode(event: DragEvent) {
    const img = document.createElement('img');

    const transferData =
      this.heroList[event.dataTransfer!.getData('text/plain')];
    img.id = transferData['id'];
    img.src = transferData['img'];

    console.log(transferData['id']);
    if (
      (<HTMLDivElement>event.target).id === 'selected-hero' ||
      (<HTMLImageElement>event.target).parentElement!.id === 'selected-hero'
    ) {
      if (this.selectedOpponentId === transferData['id']) {
        return;
      }

      const heroChild = this.element[1].children[0].children[0];

      if (heroChild.firstElementChild) {
        heroChild.firstElementChild.remove();
      }
      heroChild.appendChild(img);
      this.selectedHeroId = transferData['id'];
      return;
    }
    if (this.selectedHeroId === transferData['id']) {
      return;
    }
    const opponentChild = this.element[1].children[0].children[1];
    if (opponentChild.firstElementChild) {
      opponentChild.firstElementChild.remove();
    }
    opponentChild.appendChild(img);
    this.selectedOpponentId = transferData['id'];
    return;
  }

  @autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    if (this.gamemode === 'select') {
      this.dropHandlerSelectMode(event);
      return;
    }
    const img = document.createElement('img');
    const transferData =
      this.heroList[event.dataTransfer!.getData('text/plain')];
    const firstChild = this.element[1].children[0].children[0];

    img.id = transferData['id'];
    img.src = transferData['img'];

    if (firstChild?.firstElementChild) {
      firstChild?.firstElementChild.remove();
    }
    firstChild!.appendChild(img);
    this.selectedHeroId = transferData['id'];
    return;
  }

  @autobind
  clickHandler(event: MouseEvent) {
    if (this.gamemode === 'random') {
      if (this.selectedHeroId) this.callGameView(this.selectedHeroId, 'random');
      return;
    }

    if (this.selectedHeroId && this.selectedOpponentId) {
      this.callGameView(
        this.selectedHeroId,
        'selected',
        this.selectedOpponentId
      );
    }
    return;
  }

  async callGameView(heroId: string, gamemode: string, opponentId?: string) {
    let init;
    try {
      init = dataContainer.initGameState(heroId, gamemode, opponentId!);

      await Router.gameView();
    } catch (err) {
      console.log(err);
    }
  }

  @autobind
  private toggleGameMode(event: MouseEvent) {
    const opponentBox = this.element[1].children[0].children[1];
    opponentBox.firstElementChild?.remove();

    if (this.gamemode === 'random') {
      this.gamemode = 'select';
      (<HTMLElement>event.target).textContent = 'select';
      opponentBox.id = 'selected-opponent';
      return;
    }
    this.gamemode = 'random';
    (<HTMLElement>event.target).textContent = 'random';
    opponentBox.removeAttribute('id');
    opponentBox.classList.remove('droppable');
    return;
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
    (<HTMLInputElement>this.element[2].children[0]).addEventListener(
      'click',
      this.toggleGameMode
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
