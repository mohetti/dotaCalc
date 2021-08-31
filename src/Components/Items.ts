import { ItemValues, ItemValuesChild } from '../Models/responseModels';
const img = require('../imgs/noitems.png');

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
  plainItemObj(itemsArr: number[] | string[]) {
    let itemProperties: ItemValuesChild[] = [];
    itemsArr.map((x) => {
      if (x === undefined || x === 999) {
        itemProperties.push({
          dname: 'no item',
          id: 999,
          img: img,
        });
        return;
      }
      if (x) {
        itemProperties.push(this.list[x]);
        return;
      }
    });

    return itemProperties;
  }
}
