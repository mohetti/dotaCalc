import { Component } from './Component';
import { dataContainer } from '../index';

export class GameView extends Component<HTMLDivElement, [HTMLDivElement]> {
  static instance: GameView;

  constructor() {
    super('tmpl-game-view', 'app');
    this.render();
    this.dispatch();
    this.attach(true);
  }

  render() {
    const heroContainer = this.element[0].firstElementChild!.children[0];
    const opponentContainer = this.element[0].firstElementChild!.children[2];
    // Hero and Opponent Img Loading
    (<HTMLImageElement>heroContainer.children[0]).src =
      dataContainer.gameState.heroObj['img'];
    (<HTMLImageElement>opponentContainer.children[0]).src =
      dataContainer.gameState.currentOpponent['img'];

    // Loading items
    const heroItems = Object.values(dataContainer.gameState.heroItems);
    heroItems.map((x) => {
      const img = document.createElement('img');
      img.src = x['img'];
      heroContainer.children[1].appendChild(img);
    });

    const opponentItems = Object.values(dataContainer.gameState.opponentItems);
    opponentItems.map((x) => {
      const img = document.createElement('img');
      img.src = x['img'];
      opponentContainer.children[1].appendChild(img);
      return;
    });
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new GameView();
    return this.instance;
  }
}
