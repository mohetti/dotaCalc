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
  plainItemObj(itemsArr: number[] | string[]) {
    const itemProperties: ItemValuesChild[] = [];
    itemsArr.map((x) => {
      if (x) {
        itemProperties.push(this.list[x]);
      }
    });
    return itemProperties;
  }
}
