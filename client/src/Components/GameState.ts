import { dataContainer } from '../index';
import { HeroValues } from '../Models/responseModels';

export class GameState {
  heroObj;
  heroItems;
  currentOpponent;
  opponentItems;
  gameMode;
  heroKeys;

  constructor(heroId: string, gameMode: string) {
    this.gameMode = gameMode;

    // get hero
    this.heroObj = dataContainer.heroes.plainHeroObj(heroId);
    this.heroKeys = Object.keys(dataContainer.heroes.list as HeroValues);

    // get current Opponent
    const randomIndex = Math.floor(Math.random() * this.heroKeys.length);
    this.currentOpponent! = dataContainer.heroes.plainHeroObj(
      this.heroKeys[randomIndex].toString()
    );

    // get hero items
    const itemKeys = Object.values(
      dataContainer.heroStartItems[this.heroObj['id']]
    );
    this.heroItems = dataContainer.items.plainItemObj(itemKeys);

    // get opponent items
    const oppItemKeys = Object.values(
      dataContainer.heroStartItems[this.currentOpponent['id']]
    );
    this.opponentItems = dataContainer.items.plainItemObj(oppItemKeys);

    // remove opp from list of keys
    this.heroKeys.splice(randomIndex, 1);
  }
}
