import { ItemValues } from '../Models/responseModels';

export class Items {
  static instance: Items;
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

  static getInstance(apiResponse: ItemValues) {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Items(apiResponse);
    return this.instance;
  }
}
