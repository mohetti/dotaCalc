import { APIRequest } from './_APIRequest';
import { HeroAndItemRequirements } from '../Models/heroAndItemReqs';
import { ResponseItemValues } from '../Models/responseModels';

export class Items extends APIRequest implements HeroAndItemRequirements {
  protected static instance: Items;
  itemList: ResponseItemValues = {};
  protected constructor(baseUrl: string, urlExtension: string) {
    super(baseUrl, urlExtension);
    this.modifyContents();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Items(
      'https://api.opendota.com/api',
      '/constants/items'
    );
    return this.instance;
  }
  async modifyContents() {
    const data = await this.getContents();
    for (const key in data) {
      this.itemList[data[key]['id']] = {
        img: data[key]['img'],
        dname: data[key]['dname'],
        id: data[key]['id'],
      };
    }
  }
  renderContent() {}
}
