import { Router } from './Components/Router';
import { Util } from './Components/Util';
import { Heroes } from './Components/Heroes';
import { Items } from './Components/Items';
import { DataContainer } from './Components/DataContainer';

Router.loading();
export const dataContainer = new DataContainer();

Util.getData('https://api.opendota.com/api', '/constants/heroes')
  .then((res) => {
    dataContainer.initHeroList(res);
    Router.startView();
  })
  .catch((err) => {
    console.log(err);
  });

Util.getData('https://api.opendota.com/api', '/constants/items')
  .then((res) => {
    dataContainer.initItemList(res);
  })
  .catch((err) => {
    console.log(err);
  });
