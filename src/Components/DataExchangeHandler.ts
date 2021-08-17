import { HeroValues, ItemValues } from '../Models/responseModels';
import { Heroes } from './Heroes';
import { Items } from './Items';

export class DataExchangeHanlder {
  static instance: DataExchangeHanlder;

  heroList: HeroValues = {};
  initHeroList(apiResponse: HeroValues) {
    const heroes = Heroes.getInstance(apiResponse);
    this.heroList = heroes.list;
  }

  itemList: ItemValues = {};
  initItemList(apiResponse: ItemValues) {
    const items = Items.getInstance(apiResponse);
    this.itemList = items.list;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DataExchangeHanlder();
    return this.instance;
  }
}
