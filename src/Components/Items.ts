import { ItemValues, ItemValuesChild } from '../Models/responseModels';

export class Items {
  list: ItemValues;
  constructor(apiResponse: ItemValues) {
    this.list = {};
    for (const key in apiResponse) {
      this.list[apiResponse[key]['id']] = {
        img: 'https://api.opendota.com' + apiResponse[key]['img'],
        dname: apiResponse[key]['dname'],
        id: apiResponse[key]['id'],
      };
    }
  }
  plainItemObj(itemsArr: number[]) {
    const itemProperties: ItemValuesChild[] = [];
    itemsArr.map((x) => {
      if (x) {
        itemProperties.push(this.list[x]);
      }
    });
    return itemProperties;
  }
  getOpponentItems(gameMode: string, heroId: string) {
    if (gameMode === 'random') {
      const listClone = { ...this.list };
      delete listClone[+heroId];
      return listClone;
    }
  }
}
