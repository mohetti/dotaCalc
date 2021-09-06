import { HeroValues, ItemValues } from '../Models/responseModels';
import { GameState } from './GameState';
import { Heroes } from './Heroes';
import { Items } from './Items';
import { heroStartItems } from '../Models/heroStartItems/startItems';

export class DataContainer {
  heroes!: Heroes;
  initHeroList(apiResponse: HeroValues) {
    const heroes = new Heroes(apiResponse);
    return (this.heroes = heroes);
  }

  items!: Items;
  initItemList(apiResponse: ItemValues) {
    const items = new Items(apiResponse);
    return (this.items = items);
  }
  gameState!: GameState;
  initGameState(heroId: string, gameMode: string, opponentId?: string) {
    const gameState = new GameState(heroId, gameMode, opponentId);
    return (this.gameState = gameState);
  }
  heroStartItems = heroStartItems;
}
