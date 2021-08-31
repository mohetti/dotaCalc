import { dataContainer } from '../index';
import {
  HeroValues,
  HeroValuesChild,
  ItemValuesChild,
} from '../Models/responseModels';
import { itemStats } from '../Models/heroStartItems/startItems';

export class GameState {
  heroObj;
  heroItems;
  currentOpponent!: HeroValuesChild;
  opponentItems!: ItemValuesChild[];
  gameMode;
  heroKeys;
  startItems!: ItemValuesChild[];
  heroGold!: number;
  opponentGold!: number;

  constructor(heroId: string, gameMode: string) {
    this.gameMode = gameMode;

    // get hero
    this.heroObj = dataContainer.heroes.plainHeroObj(heroId);
    this.heroKeys = Object.keys(dataContainer.heroes.list as HeroValues);

    // get hero items
    const itemKeys = Object.values(
      dataContainer.heroStartItems[this.heroObj['id']]
    );
    this.heroItems = dataContainer.items.plainItemObj(itemKeys);
    this.setGold(this.heroItems, 'heroGold');

    this.setCurrentOpponent();
    this.getOpponentItems();
    this.getStartItems();
  }

  initChange(newItem: string, oldItem: string, target: string) {
    if (target === 'hero') {
      this.setHeroItems(newItem, oldItem);
      this.setGold(this.heroItems, 'heroGold');
      return true;
    }
    if (target === 'opponent') {
      this.setOpponentItems(newItem, oldItem);
      this.setGold(this.opponentItems, 'opponentGold');
      return true;
    }
  }

  enoughGold(newItem: string, oldItem: string, target: string) {
    const goldCount =
      +this[target as keyof GameState] +
      itemStats[newItem].gold -
      itemStats[oldItem].gold;
    return goldCount < 601;
  }

  private setOpponentItems(newItem: string, oldItem: string) {
    let list = [];
    this.opponentItems.map((x) => {
      list.push(+x.id);
    });
    let index = this.opponentItems.findIndex((x) => {
      return x.id === +oldItem;
    });

    list[index] = +newItem;
    this.opponentItems = dataContainer.items.plainItemObj(list);
  }

  private setHeroItems(newItem: string, oldItem: string) {
    let list = [];
    this.heroItems.map((x) => {
      list.push(+x.id);
    });
    let index = this.heroItems.findIndex((x) => {
      return x.id === +oldItem;
    });

    list[index] = +newItem;
    this.heroItems = dataContainer.items.plainItemObj(list);
  }

  private setCurrentOpponent() {
    const randomIndex = Math.floor(Math.random() * this.heroKeys.length);
    this.currentOpponent! = dataContainer.heroes.plainHeroObj(
      this.heroKeys[randomIndex].toString()
    );
    // remove opp from list of keys
    this.heroKeys.splice(randomIndex, 1);
  }

  private getOpponentItems() {
    const oppItemKeys = Object.values(
      dataContainer.heroStartItems[this.currentOpponent['id']]
    );
    this.opponentItems = dataContainer.items.plainItemObj(oppItemKeys);
    this.setGold(this.opponentItems, 'opponentGold');
  }

  private getStartItems() {
    const itemKeys = Object.keys(itemStats);
    this.startItems = dataContainer.items.plainItemObj(itemKeys);
  }

  private setGold(
    items: ItemValuesChild[],
    target: 'heroGold' | 'opponentGold'
  ) {
    let gold = 0;
    items.map((x) => {
      if (x !== undefined) {
        gold += itemStats[x['id']].gold;
      }
    });

    this[target] = gold;
  }
}