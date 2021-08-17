import { Router } from './Components/Router';
import { Util } from './Components/Util';
import { Heroes } from './Components/Heroes';
import { Items } from './Components/Items';
import { DataExchangeHanlder } from './Components/DataExchangeHandler';

Router.loading();
const dataExchangeHandler = DataExchangeHanlder.getInstance();

export let heroes: Heroes;
export let items: Items;
Util.getData('https://api.opendota.com/api', '/constants/heroes')
  .then((res) => {
    dataExchangeHandler.initHeroList(res);
    Router.startView();
  })
  .catch((err) => {
    console.log(err);
  });

Util.getData('https://api.opendota.com/api', '/constants/items')
  .then((res) => {
    dataExchangeHandler.initItemList(res);
  })
  .catch((err) => {
    console.log(err);
  });
